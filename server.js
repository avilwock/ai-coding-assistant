import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import express from 'express';
//not used anymore
// const bodyParser = require('body-parser')
import { PromptTemplate } from "@langchain/core/prompts"

const app = express();
//to put it online
app.use(express.json());
const port = 3000;

//not used anymore
// app.use(bodyParser.json());

dotenv.config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-4o-mini"
});

const prompt = new PromptTemplate({
    template: "You are a programming expert and will only answer the user's coding question as thoroughly as possible using JavaScript. If the question is unrelated to coding, do not answer. \n {question}",
    inputVariables: ["question"]
})

const promptFunc = async (input) => {
    try {
        const promptInput = await prompt.format({
            question: input
        });

        const res = await model.invoke(promptInput);
        return res.content;
    } catch (err) {
        console.error(err);
        throw(err);
    }
}

promptFunc("How do you capitalize all characters of a string in JavaScript?")
  .then(console.log)
  .catch(console.error);

  app.post('/ask', async (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    try {

        const userQuestion = req.body.question;

        if (!userQuestion) {
            return res.status(400).json({ error: 'Please provide a question in the request body.'});
        }
        const result = await promptFunc(userQuestion);
        res.json({result});
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
  });

  //PUt this online
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });