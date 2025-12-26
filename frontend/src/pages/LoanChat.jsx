import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { generateSanctionLetter } from "../workerAgents/sanctionAgent";

// Income Extraction Utility

const extractIncome = (message) => {
  const text = message.toLowerCase().replace(/,/g, "").trim();

  if (/(\d+(\.\d+)?)\s?k/.test(text)) {
    return parseFloat(text.match(/(\d+(\.\d+)?)/)[0]) * 1000;
  }

  if (/(\d+(\.\d+)?)\s?(l|lakh)/.test(text)) {
    return parseFloat(text.match(/(\d+(\.\d+)?)/)[0]) * 100000;
  }

  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export default function LoanChat() {
  const [messages, setMessages] = useState([
    {
      sender: "Ava 🤖",
      text: "Hi there 👋 I’m Ava, your Tata Capital Loan Assistant. What type of loan are you looking for today?",
      time: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [stage, setStage] = useState("LOAN_TYPE"); 
  // LOAN_TYPE → INCOME → KYC → UNDERWRITING → DONE

  const [context, setContext] = useState({
    loanType: null,
    income: null,
    kycVerified: false,
    customer: null,
    requestedAmount: null,
  });

  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "You 💬",
      text: input.trim(),
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = input.trim();
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      const botReply = generateBotReply(userInput);
      if (botReply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Ava 🤖",
            text: botReply,
            time: new Date(),
          },
        ]);
      }
      setIsTyping(false);
    }, 1200);
  };

//    MASTER AGENT LOGIC
  const generateBotReply = async (userInput) => {
    const lower = userInput.toLowerCase();

    // STAGE 1: LOAN TYPE
    if (stage === "LOAN_TYPE") {
      if (lower.includes("personal")) {
        setContext((p) => ({ ...p, loanType: "PERSONAL" }));
        setStage("INCOME");
        return "Great choice 😊 Personal loans are perfect for travel, weddings, or emergencies.\n\nCould you please share your monthly income?";
      }

      if (lower.includes("business")) {
        setContext((p) => ({ ...p, loanType: "BUSINESS" }));
        setStage("INCOME");
        return "Awesome! Business loans help grow ventures.\n\nPlease share your monthly income to proceed.";
      }

      return "We currently offer personal and business loans. Which one would you like to explore?";
    }

    // STAGE 2: INCOME
    if (stage === "INCOME") {
      const income = extractIncome(userInput);

      if (income === null) {
        return "Could you please share your income in numbers? For example: 30,000 or 30k.";
      }

      if (income <= 0) {
        return (
          "Hmm 🤔 it looks like your income is ₹0.\n\n" +
          "Unfortunately, we can’t proceed with a standard loan without income.\n" +
          "You may consider:\n" +
          "1️⃣ Secured loan (against gold/property)\n" +
          "2️⃣ Co-applicant loan"
        );
      }

      setContext((p) => ({ ...p, income }));
      setStage("KYC");

      return (
        `Thanks 😊 I’ve noted your income as ₹${income.toLocaleString()}.\n\n` +
        "To continue, please share your registered name or mobile number for KYC verification."
      );
    }

    // STAGE 3: KYC VERIFICATION
    if (stage === "KYC") {
  try {
    const res = await fetch("http://localhost:5000/api/agent/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: userInput }),
    });

    const result = await res.json();

    if (result.status === "VERIFIED") {
      setContext((p) => ({
        ...p,
        kycVerified: true,
        customer: result.customer,
      }));
      setStage("UNDERWRITING");

      return (
        "KYC verified successfully ✅\n\n" +
        "Now let’s proceed to credit evaluation 📊\n\n" +
        "How much loan amount are you looking for?"
      );
    }

    if (result.status === "PENDING") {
      return "Your KYC is pending. Please complete your KYC before proceeding.";
    }

    if (result.status === "NOT_FOUND") {
      return "I couldn’t find your KYC details. Please re-check your registered name or mobile number.";
    }

    return "Something went wrong during verification. Please try again.";

  } catch (error) {
    console.error("KYC API error:", error);
    return "⚠️ Unable to verify KYC right now. Please try again in a moment.";
  }
}
    //  STAGE 4: UNDERWRITING (placeholder)
    
    if (stage === "UNDERWRITING") {
  const amount = extractIncome(userInput);

  if (!amount || amount <= 0) {
    return "Please enter a valid loan amount (e.g., 2,00,000 or 2L).";
  }
setContext((p) => ({ ...p, requestedAmount: amount }));
  try {
    const res = await fetch("http://localhost:5000/api/agent/underwrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: context.customer,
        income: context.income,
        requestedAmount: amount,
      }),
    });

    const result = await res.json();

    // ❌ REJECTED
    if (result.status === "REJECTED") {
      setStage("DONE");
      return (
        `❌ Unfortunately, your loan cannot be approved.\n\n` +
        `Reason: ${result.reason}\n` +
        `Credit Score: ${result.creditScore}`
      );
    }

    // 🧾 SALARY SLIP REQUIRED
    if (result.status === "SALARY_SLIP") {
      setStage("DONE");
      return (
        `🧾 Additional verification required.\n\n` +
        `Your credit score is ${result.creditScore}, but the requested amount exceeds your pre-approved limit of ₹${result.limit.toLocaleString()}.\n\n` +
        `Please upload your salary slip to continue.`
      );
    }

    // ✅ APPROVED
    if (result.status === "APPROVED") {
  // ✅ Trigger sanction letter AFTER underwriting approves
  generateSanctionLetter({
    customer: context.customer,
    loanAmount: amount,
    emi: result.emi,
    creditScore: result.creditScore,
  });

  setStage("DONE");

  return (
    `🎉 **Loan Approved!**\n\n` +
    `Approved Amount: ₹${amount.toLocaleString()}\n` +
    `Credit Score: ${result.creditScore}\n` +
    `Estimated EMI: ₹${result.emi}\n\n` +
    `📄 Your **sanction letter has been generated and downloaded**.\n` +
    `Thank you for choosing Tata Capital!`
  );
}

    return "Something went wrong during underwriting. Please try again.";

  } catch (error) {
    console.error("Underwriting API error:", error);
    return "⚠️ Unable to process underwriting right now. Please try again later.";
  }
}
    // STAGE 5: DONE

    return "Our conversation is complete 😊 If you’d like to start again, just say hi.";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-indigo-600 text-white p-4 font-semibold text-lg">
        💬 Ava — Your Loan Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender.includes("You") ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-md p-3 rounded-2xl ${
                m.sender.includes("You")
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="font-semibold text-sm">{m.sender}</p>
              <p>{m.text}</p>
              <p className="text-xs text-gray-400 text-right">
                {m.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="text-gray-500 animate-pulse">Ava is typing…</div>
        )}

        <div ref={endRef} />
      </div>

      <div className="p-3 border-t bg-white flex items-center">
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-indigo-600 text-white p-2 rounded-full"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
