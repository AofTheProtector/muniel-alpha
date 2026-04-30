const axios = require('axios');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required and must be a string' });
  }
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemma-3-27b-it:free',
        messages: [{ role: 'user', content: question }],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://acceltrinity.tech',
        },
      }
    );
    const answer = response.data.choices[0]?.message?.content || 'ไม่มีคำตอบ';
    return res.status(200).json({ answer });
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error('Error:', errorDetails);
    return res.status(500).json({ error: 'Failed to generate answer', details: errorDetails });
  }
};
