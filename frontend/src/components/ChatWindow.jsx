import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import FileUploader from "./FileUploader";
import { postChat, uploadSalarySlip } from "../api/api";


ChatWindow.propTypes = {
  customerId: PropTypes.string
};

ChatWindow.defaultProps = {
  customerId: undefined
};

export default function ChatWindow({ customerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [convId, setConvId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    // initial greeting from assistant
    (async () => {
      try {
        setLoading(true);
        const res = await postChat(null, "hello", customerId || undefined);
        setConvId(res.conversation_id);
        appendMessage("assistant", res.assistant_message);
      } catch (err) {
        setError("Failed to initialize chat");
        appendMessage("assistant", "Failed to connect to server");
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId]);

  function appendMessage(from, text) {
    setMessages((m) => [...m, { from, text, ts: new Date() }]);
    setTimeout(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, 50);
  }

  async function send(msg) {
    if (!msg || loading) return;
    appendMessage("user", msg);
    setInput("");
    setLoading(true);
    try {
      const res = await postChat(convId, msg, customerId || undefined);
      setConvId(res.conversation_id);
      appendMessage("assistant", res.assistant_message);
    } catch (err) {
      appendMessage("assistant", "Sorry, I couldn't reach the server. (This is a frontend demo — connect backend at http://localhost:8000)");
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(file) {
    appendMessage("user", "Uploaded a file: " + file.name);
    // Option 1: call backend upload endpoint
    try {
      appendMessage("assistant", "Uploading salary slip...");
      const res = await uploadSalarySlip(convId, customerId, file);
      appendMessage("assistant", "Upload successful: " + JSON.stringify(res));
      // re-trigger chat to notify master agent
      const follow = await postChat(convId, "salary uploaded", customerId);
      appendMessage("assistant", follow.assistant_message);
    } catch (err) {
      appendMessage("assistant", "Upload failed locally (demo). You can also type your monthly salary.");
    }
  }

  return (
    <div>
      <div className="h-[60vh] overflow-auto p-4 border rounded-md chat-scroll" ref={scrollRef}>
        {messages.map((m, i) => <MessageBubble key={i} from={m.from} text={m.text} ts={m.ts} />)}
      </div>

      <div className="mt-3">
        <QuickActions onAction={(t) => send(t)} />

        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => send(input)} className="px-4 py-2 bg-indigo-600 text-white rounded-md">{loading ? "..." : "Send"}</button>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm text-gray-600 mb-2">Salary slip (optional)</div>
          <FileUploader onFile={handleFile} />
        </div>
      </div>
    </div>
  );
}
