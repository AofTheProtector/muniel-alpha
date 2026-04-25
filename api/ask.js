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
  const modelID = "bigscience/bloomz-560m";
  const apiUrl = `https://api-inference.huggingface.co/models/${modelID}`;
  const prompt = `คำถาม:${question}\nคำตอบ:`;
  try {
    const response = await axios.post(
      apiUrl,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const generatedText = response.data[0]?.generated_text || '';
    let answer = generatedText.trim();
    if (answer.startsWith(prompt)) {
      answer = answer.replace(prompt, '').trim();
    }
    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Error calling Hugging Face API:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to generate answer' });
  }
};
