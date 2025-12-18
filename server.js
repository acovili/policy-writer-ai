import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());

// Root route to check if backend is live
app.get("/", (req, res) => {
  res.send("Policy Writer AI backend is running");
});

// POST endpoint to generate Privacy Policy
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
app.post("/generate/terms-and-conditions", async (req, res) => {
  try {
    const {
      businessName,
      websiteUrl,
      businessType,
      servicesProvided,
      governingLaw,
      contactEmail
    } = req.body;

    const prompt = `
Generate professional Terms and Conditions for a business website.

Business Name: ${businessName}
Website URL: ${websiteUrl}
Business Type: ${businessType}
Services Provided: ${servicesProvided}
Governing Law / Jurisdiction: ${governingLaw}
Contact Email: ${contactEmail}

Include the following sections:
- Acceptance of Terms
- Use of Services
- User Responsibilities
- Intellectual Property
- Payments (if applicable)
- Limitation of Liability
- Termination
- Governing Law
- Changes to Terms
- Contact Information

Use clear headers, professional legal tone, and include a disclaimer that this is not legal advice.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate Terms and Conditions. Not legal advice." },
        { role: "user", content: prompt }
      ]
    });

    const terms = completion.choices[0].message.content;
    res.json({ terms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate terms and conditions" });
  }
});
app.post("/generate/cookie-policy", async (req, res) => {
  try {
    const {
      businessName,
      websiteUrl,
      cookieTypes,
      thirdParties,
      consentMethod,
      contactEmail
    } = req.body;

    const prompt = `
Generate a professional Cookie Policy for a website.

Business Name: ${businessName}
Website URL: ${websiteUrl}
Types of Cookies Used: ${cookieTypes.join(", ")}
Third-party services using cookies: ${thirdParties.join(", ")}
Consent Method: ${consentMethod}
Contact Email: ${contactEmail}

Include the following sections:
- What Are Cookies
- How We Use Cookies
- Types of Cookies We Use
- Third-Party Cookies
- Managing Cookie Preferences
- Consent
- Updates to This Policy
- Contact Information

Use clear headers, professional tone, include a "Last Updated" date, and a disclaimer that this is not legal advice.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate Cookie Policies. Not legal advice." },
        { role: "user", content: prompt }
      ]
    });

    const cookiePolicy = completion.choices[0].message.content;
    res.json({ cookiePolicy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate cookie policy" });
  }
});
