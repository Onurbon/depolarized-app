import { Configuration, OpenAIApi } from "openai";
import { openaiConfig } from "../secrets";

const configuration = new Configuration(openaiConfig);

const openai = new OpenAIApi(configuration);

export const callGPT = async (model: string, prompt: string) => {
  console.log("Calling GPT", { model, prompt });
  return await openai.createChatCompletion({
    model,
    messages: [{ role: "user", content: prompt }],
  });
};

export const callDALLE = async (prompt: string) => {
  return await openai.createImage({
    prompt,
    n: 1,
    size: "512x512",
  });
};
