const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper for date
function getToday() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Health check
app.get("/", (req, res) => {
  res.send("Server is live");
});

/* ================= PRIVACY POLICY ================= */
app.post("/generate/privacy-policy", async (req, res) => {
  try {
    const {
      businessName,
      websiteUrl,
      businessType,
      dataCollected,
      thirdParties,
      contactEmail,
    } = req.body;

    const prompt = `
Generate a professional Privacy Policy.

Business Name: ${businessName}
Website URL: ${websiteUrl}
Business Type: ${businessType}
Data Collected: ${dataCollected.join(", ")}
Third Parties: ${thirdParties.join(", ")}
Contact Email: ${contactEmail}

Include headers, professional tone, Last Updated: ${getToday()}, and legal disclaimer.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ policy: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Privacy policy generation failed" });
  }
});

/* ================= TERMS & CONDITIONS ================= */
app.post("/generate/terms-and-conditions", async (req, res) => {
  try {
    const {
      businessName,
      websiteUrl,
      businessType,
      servicesProvided,
      governingLaw,
      contactEmail,
    } = req.body;

    const prompt = `
Generate professional Terms and Conditions.

Business Name: ${businessName}
Website URL: ${websiteUrl}
Business Type: ${businessType}
Services Provided: ${servicesProvided}
Governing Law: ${governingLaw}
Contact Email: ${contactEmail}

Include headers, Last Updated: ${getToday()}, and legal disclaimer.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ terms: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
