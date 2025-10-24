import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// send user message to backend
export async function postChat(conversationId, userMessage, customerId) {
  const payload = {
    conversation_id: conversationId,
    user_message: userMessage,
    customer_id: customerId || undefined,
  };
  const res = await axios.post(`${BASE_URL}/chat`, payload);
  return res.data;
}

// upload salary slip to backend
export async function uploadSalarySlip(conversationId, customerId, file) {
  const form = new FormData();
  form.append("file", file);
  form.append("customer_id", customerId);
  form.append("conversation_id", conversationId);

  const res = await axios.post(`${BASE_URL}/upload-salary`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}
