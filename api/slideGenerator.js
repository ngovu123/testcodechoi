const axios = require('axios');

async function getSlidesFromTranscription(transcription) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

  const prompt = `You are an AI that converts text into slides with headers and bullet points. Turn the following text into slides:

${transcription}

EXAMPLE:

[
{
"Header": "Seattle, Washington",
"BulletPoints": [
"Seat of King County, Washington",
"Population of 737,015 (2020)",
"Largest city in Washington and the Pacific Northwest"
]
},
{
"Header": "Geography and Trade",
"BulletPoints": [
"Located between Puget Sound & Lake Washington",
"Major gateway for trade with East Asia"
]
}
]

YOUR RESPONSE:`;

  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const responseText = response.data.choices[0].message.content.trim();
    const parsedResponse = JSON.parse(responseText);
    return parsedResponse;
  } catch (error) {
    console.error('Error getting slides:', error);
    throw new Error('Error getting slides');
  }
}

module.exports = {
  getSlidesFromTranscription,
};
