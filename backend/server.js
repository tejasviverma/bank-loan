import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// --- Chat Endpoint ---
app.post("/chat", (req, res) => {
  const { conversation_id, user_message, customer_id } = req.body;

  console.log("Received chat:", { conversation_id, user_message, customer_id });

  // Send a simple mock response
  const botResponse = `Hello! You said: "${user_message}". I'll help you with your loan query.`;

  res.json({
    response: botResponse,   // <--- ensure this key is 'response'
    conversation_id,
  });
});

// --- File Upload Endpoint ---
app.post("/upload-salary", upload.single("file"), (req, res) => {
  const { customer_id, conversation_id } = req.body;
  console.log("File uploaded for:", { customer_id, conversation_id });
  console.log("File info:", req.file);

  res.json({
    message: "Salary slip uploaded successfully!",
    filename: req.file.filename,
  });
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
