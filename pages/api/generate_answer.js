import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateAnswers(question),
      temperature: 0.6,
      max_tokens: 900,
    });
    res.status(200).json({ result2: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateAnswers(question) {
  const capitalizedQuestion = question.toLowerCase();
  return `This is the template for writing 8-mark IGCSE economics responses:

  Define economic terms present in the question. One point in favour of the question. Elaborate on how it will affect the economy/market. Second point in favour of the question. Elaborate on how it will affect the economy/market. Third point in favour of the question. Elaborate on how it will affect the economy/market. One point against the question. Elaborate on how it will affect the economy/market. Second point against the question. Elaborate on how it will affect the economy/market. Third point against the question. Elaborate on how it will affect the economy/market. A short conclusion. 
  
  Elaborate on every point for and against with a lot of detail and give the final answer in paragraph form. 
  
  Based on that, respond to this question: ${capitalizedQuestion}`;
}


