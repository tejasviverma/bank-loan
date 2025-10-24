import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [customerId, setCustomerId] = useState("");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden">
        <header className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Tata Capital — Personal Loan Assistant</h1>
            <p className="text-sm text-gray-500">Smart chatbot to help customers apply for personal loans</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter Customer ID (e.g., CUST001)"
              className="px-3 py-1 border rounded-md text-sm"
            />
            <button
              onClick={() => window.alert("Customer ID set for demo: " + customerId)}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
            >
              Use ID
            </button>
          </div>
        </header>

        <main className="p-4">
          <ChatWindow customerId={customerId} />
        </main>
      </div>
    </div>
  );
}
