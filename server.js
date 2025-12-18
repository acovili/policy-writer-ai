const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getToday() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

app.get("/", (req, res) => {
  res.send("Policy Writer AI backend is running");
});

/* ---------- PRIVACY POLICY ---------- */
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
Data Collected: ${(dataCollected || []).join(", ")}
Third Parties: ${(thirdParties || []).join(", ")}
Contact Email: ${contactEmail}
Last Updated: ${getToday()}
Include disclaimer that this is not legal advice.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ policy: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Privacy policy failed" });
  }
});

/* ---------- TERMS ---------- */
app.post("/generate/terms-and-conditions", async (req, res) => {
  try {
    const prompt = `
Generate Terms and Conditions.
Business Name: ${req.body.businessName}
Website URL: ${req.body.websiteUrl}
Contact Email: ${req.body.contactEmail}
Last Updated: ${getToday()}
Include disclaimer not legal advice.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ terms: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terms failed" });
  }
});

/* ---------- COOKIE POLICY ---------- */
app.post("/generate/cookie-policy", async (req, res) => {
  try {
    const prompt = `
Generate Cookie Policy.
Business Name: ${req.body.businessName}
Website URL: ${req.body.websiteUrl}
Cookies: ${(req.body.cookieTypes || []).join(", ")}
Third Parties: ${(req.body.thirdParties || []).join(", ")}
Consent Method: ${req.body.consentMethod}
Contact Email: ${req.body.contactEmail}
Last Updated: ${getToday()}
Include disclaimer not legal advice.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ cookiePolicy: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cookie policy failed" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
