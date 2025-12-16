import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate/privacy-policy", async (req, res) => {
  try {
    const { businessName, websiteUrl, businessType, dataCollected, thirdParties, contactEmail } = req.body;

    const prompt = `
Generate a professional Privacy Policy for a website.
Business Name: ${businessName}
Website URL: ${websiteUrl}
Business Type: ${businessType}
Data Collected: ${dataCollected.join(", ")}
Third-party services: ${thirdParties.join(", ")}
Contact Email: ${contactEmail}
Include clear headers, professional tone, "Last Updated" date, and a disclaimer that this is not legal advice.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate Privacy Policies. Not legal advice." },
        { role: "user", content: prompt }
      ]
    });

    const policy = completion.choices[0].message.content;
    res.json({ policy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate policy" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
