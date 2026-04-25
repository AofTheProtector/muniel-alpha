const axios = require('axios');

module.exports = async (req, res) => {
  // Only allow POST
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

  // Using a multilingual model suitable for Thai advice generation
  // You can change the model ID as needed
  const modelID = "bigscience/bloomz-560m";
  const apiUrl = `https://api-inference.huggingface.co/models/${modelID}`;

  // Prepare the prompt in Thai
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
          return_full_text: false, // Only return the generated text
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // The API returns an array of objects with generated_text
    const generatedText = response.data[0]?.generated_text || '';

    // Clean up the response: remove the prompt if it's echoed
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
