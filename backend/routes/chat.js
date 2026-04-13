const router = require('express').Router();

const SYSTEM_PROMPT = `You are CyberGuard, an expert AI cybersecurity assistant for the CyberSafe awareness platform.
You help users understand cyber threats including phishing, malware, ransomware, DDoS attacks, social engineering, and general cybersecurity best practices.
You can also help with basic tasks such as:
- Analyzing suspicious emails or messages for phishing indicators
- Evaluating password strength and giving improvement tips
- Explaining security concepts clearly to non-technical users
- Recommending security tools and practices

Keep responses clear, concise, and actionable (3-6 sentences or bullet points).
Use simple language that non-technical users can understand.
If asked about non-security topics, politely redirect to cybersecurity.
Format your responses using markdown (bold, bullets) for readability.`;

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'GROQ_API_KEY is not configured.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 512,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', response.status, err);
      return res.status(502).json({ error: 'AI service error', status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';

    res.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
