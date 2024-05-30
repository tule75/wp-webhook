const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.API_KEY, 
});

exports.chatWithGPT = async (query) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: query }],
    model: 'gpt-3.5-turbo',
  });
  return chatCompletion.choices[0].message.content
}

