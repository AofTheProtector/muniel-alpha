const axios = require('axios');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required and must be a string' });
  }
  const HF_API_KEY = process.env.HF_API_KEY;
  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const modelID = "mistralai/Mistral-7B-Instruct-v0.1";
  const apiUrl = `https://router.huggingface.co/hf-inference/models/${modelID}/v1/chat/completions`;
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: modelID,
        messages: [
          { role: "user", content: question }
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const answer = response.data.choices[0]?.message?.content || '';
    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Error calling Hugging Face API:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to generate answer' });
  }
};
