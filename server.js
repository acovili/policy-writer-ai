app.use(express.json());

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate privacy policy" });
  }
});
