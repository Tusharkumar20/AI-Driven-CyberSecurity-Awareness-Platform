const router = require('express').Router();

router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Search is not configured. BRAVE_API_KEY is missing.' });
  }

  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=5&search_lang=en&safesearch=moderate`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Brave API error:', response.status, err);
      return res.status(502).json({ error: 'Search service error', details: response.status });
    }

    const data = await response.json();

    const results = (data.web?.results || []).map(r => ({
      title: r.title,
      url: r.url,
      description: r.description,
    }));

    res.json({ results, query: q });
  } catch (err) {
    console.error('Search route error:', err.message);
    res.status(500).json({ error: 'Internal server error during search' });
  }
});

module.exports = router;
