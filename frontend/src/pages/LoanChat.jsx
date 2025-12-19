import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { verifyCustomer } from "../workerAgents/verificationAgent";

/* ===============================
   🔢 Income Extraction Utility
================================ */
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

  /* ===============================
     🧠 MASTER AGENT LOGIC
  ================================ */
  const generateBotReply = (userInput) => {
    const lower = userInput.toLowerCase();

    /* ---------- STAGE 1: LOAN TYPE ---------- */
    if (stage === "LOAN_TYPE") {
      if (lower.includes("personal")) {
        setContext((p) => ({ ...p, loanType: "PERSONAL" }));
        setStage("INCOME");
        return "Great choice 😊 Personal loans are perfect for travel, weddings, or emergencies.\n\nCould you please share your **monthly income**?";
      }

      if (lower.includes("business")) {
        setContext((p) => ({ ...p, loanType: "BUSINESS" }));
        setStage("INCOME");
        return "Awesome! Business loans help grow ventures.\n\nPlease share your **monthly income** to proceed.";
      }

      return "We currently offer **personal** and **business** loans. Which one would you like to explore?";
    }

    /* ---------- STAGE 2: INCOME ---------- */
    if (stage === "INCOME") {
      const income = extractIncome(userInput);

      if (income === null) {
        return "Could you please share your income in numbers? For example: **30,000** or **30k**.";
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
        "To continue, please share your **registered name or mobile number** for KYC verification."
      );
    }

    /* ---------- STAGE 3: KYC ---------- */
    if (stage === "KYC") {
      const result = verifyCustomer(userInput);

      if (result.status === "VERIFIED") {
        setContext((p) => ({
          ...p,
          kycVerified: true,
          customer: result.customer,
        }));
        setStage("UNDERWRITING");

        return (
          `${result.message} ✅\n\n` +
          "Now I’ll quickly check your **credit eligibility** 📊"
        );
      }

      if (result.status === "PENDING") {
        return `${result.message} Please complete your KYC before proceeding.`;
      }

      return "I couldn’t find your KYC details. Please re-check your **registered name or mobile number**.";
    }

    /* ---------- STAGE 4: UNDERWRITING (placeholder) ---------- */
    if (stage === "UNDERWRITING") {
      setStage("DONE");
      return (
        "🎉 Your profile looks good!\n\n" +
        "Based on your income and KYC, you are **eligible** to proceed further.\n" +
        "I’ll now generate your personalized loan offer."
      );
    }

    return "Our conversation is complete 😊 If you’d like to start again, just say *hi*.";
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
