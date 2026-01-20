import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import agentRoutes from "./routes/agentRoutes.js";

const app = express();


app.use(cors());            
app.use(express.json());      

connectDB();
app.use("/api", agentRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ");
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
