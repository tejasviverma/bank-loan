import React from "react";

export default function QuickActions({ onAction }) {
  return (
    <div className="flex gap-2 mt-2">
      <button onClick={() => onAction("Yes, accept the offer")} className="px-3 py-1 bg-green-500 text-white rounded">Accept</button>
      <button onClick={() => onAction("I want to negotiate terms")} className="px-3 py-1 bg-yellow-500 text-white rounded">Negotiate</button>
      <button onClick={() => onAction("Upload salary slip")} className="px-3 py-1 bg-indigo-600 text-white rounded">Upload Salary</button>
    </div>
  );
}
