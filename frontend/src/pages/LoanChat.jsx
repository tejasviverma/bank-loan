import { useState } from "react";

const STAGES = {
  LOAN_TYPE: "LOAN_TYPE",
  INCOME: "INCOME",
  KYC: "KYC",
  UNDERWRITING: "UNDERWRITING",
  DONE: "DONE",
};

export default function LoanChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I’m Ava from Tata Capital. How can I help you today?" },
    { sender: "bot", text: "Are you looking for a personal loan?" },
  ]);

  const [input, setInput] = useState("");
  const [stage, setStage] = useState(STAGES.LOAN_TYPE);
  const [isThinking, setIsThinking] = useState(false);

  const [context, setContext] = useState({
    income: null,
    customer: null,
    kycAttempts: 0,
    underwritingAttempts: 0,
  });

  const think = async (text = "Checking…") => {
  setIsThinking(true);
  addBot(text);
  await new Promise((r) => setTimeout(r, 700));
  setIsThinking(false);
};

  const addBot = (text) =>
    setMessages((m) => [...m, { sender: "bot", text }]);

  const addUser = (text) =>
    setMessages((m) => [...m, { sender: "user", text }]);

  const parseAmount = (text) => {
    const t = text.toLowerCase().replace(/,/g, "");
    if (t.includes("k")) return parseFloat(t) * 1000;
    if (t.includes("l")) return parseFloat(t) * 100000;
    const n = t.match(/\d+/);
    return n ? parseInt(n[0]) : 0;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    addUser(input);
    const userInput = input;
    setInput("");

    // ---------------- STAGE 1: LOAN TYPE ----------------
    if (stage === STAGES.LOAN_TYPE) {
      setStage(STAGES.INCOME);
      addBot("Great! Please tell me your monthly income.");
      return;
    }

    // ---------------- STAGE 2: INCOME ----------------
    if (stage === STAGES.INCOME) {
      const income = parseAmount(userInput);
      if (!income || income <= 0) {
        addBot("Please enter a valid income (e.g., 60k, 50000).");
        return;
      }

      setContext((c) => ({ ...c, income }));
      setStage(STAGES.KYC);
      addBot("Thanks! Please enter your **registered name or mobile number** 📱");
      return;
    }

    // ---------------- STAGE 3: KYC ----------------
    if (stage === STAGES.KYC) {
  try {
    await think("Verifying your KYC…");

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: userInput }),
    });

    if (!res.ok) throw new Error("KYC failed");

    const result = await res.json();

    if (result.status === "VERIFIED") {
      setContext((c) => ({ ...c, customer: result.customer, kycAttempts: 0 }));
      setStage(STAGES.UNDERWRITING);
      addBot("✅ KYC verified successfully!");
      addBot("How much **loan amount are you looking for?  (e.g., `3L`, `2,50,000`)");
      return;
    }

    // Retry handling
    setContext((c) => ({ ...c, kycAttempts: c.kycAttempts + 1 }));

    if (context.kycAttempts === 0) {
      addBot("I couldn’t find your KYC in our records.");
      addBot("Please enter your full registered name or mobile number.");
      return;
    }

    if (context.kycAttempts === 1) {
      addBot("Still having trouble finding your KYC.");
      addBot("Try one of these:\n• `Aarav Sharma`\n• `9876543210`");
      return;
    }

    // Exit gracefully
    setStage(STAGES.DONE);
    addBot("I’m unable to verify your KYC right now.");
    addBot("You can try again later or contact support for manual verification.");
    return;

  } catch {
    addBot("We’re facing a temporary issue verifying KYC. Please try again shortly.");
    return;
  }
}


    // ---------------- STAGE 4: UNDERWRITING ----------------
    if (stage === STAGES.UNDERWRITING) {
      const amount = parseAmount(userInput);
      if (!amount || amount <= 0) {
        addBot("Please enter a valid loan amount.");
        return;
      }

      try {
        await think("Evaluating your eligibility…");
        const res = await fetch("/api/underwrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: context.customer._id,
            income: context.income,
            requestedAmount: amount,
          }),
        });

        if (!res.ok) throw new Error("Underwriting failed");

        const result = await res.json();
        setStage(STAGES.DONE);

        if (result.status === "APPROVED") {
          addBot("🎉 Loan Approved!");
          addBot(`Amount: ₹${amount.toLocaleString()}`);
          addBot(`Estimated EMI: ₹${result.emi}`);
          addBot("📄 Your sanction details are ready.");
          return;
        } else if (result.status === "SALARY_SLIP_REQUIRED") {
          addBot("🧾 Additional verification required.");
      addBot("Please upload your salary slip to continue.");
      return;
        } else {
           addBot("❌ Loan Rejected");
    addBot(`Reason: ${result.reason || "Eligibility criteria not met"}`);
    addBot("You may try a lower amount or apply later.");
    return;
        }
      } catch {
        addBot("⚠️ Unable to process underwriting.");
      }
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg shadow">
      <div className="h-96 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.sender === "bot"
                ? "bg-gray-100 text-left"
                : "bg-blue-500 text-white text-right"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex border-t">
        <input
          className="flex-1 p-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
        />
        <button
          className="px-4 bg-blue-600 text-white"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
