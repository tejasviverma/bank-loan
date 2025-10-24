import React from "react";
import dayjs from "dayjs";

export default function MessageBubble({ from, text, ts }) {
  const isUser = from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`${isUser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"} max-w-[75%] p-3 rounded-lg`}>
        <div className="whitespace-pre-wrap">{text}</div>
        <div className="text-xs opacity-60 mt-1 text-right">{dayjs(ts).format("HH:mm")}</div>
      </div>
    </div>
  );
}
