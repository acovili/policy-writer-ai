import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Policy Writer AI backend is running");
});

app.post("/generate/privacy-policy", async (req, res) => {
  res.json({ policy: "AI not wired yet" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
