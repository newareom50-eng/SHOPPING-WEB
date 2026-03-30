import { GoogleGenAI } from "@google/genai";
import { Prompt } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSandboxPreview(prompt: Prompt, inputs: Record<string, string>) {
  let userMessage = prompt.userTemplate;
  
  // Replace placeholders in the template
  Object.entries(inputs).forEach(([key, value]) => {
    userMessage = userMessage.replace(`[${key}]`, value);
  });

  try {
    const response = await ai.models.generateContent({
      model: prompt.modelSettings.model,
      contents: [{ parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: prompt.systemInstruction,
        temperature: prompt.modelSettings.temperature,
        topP: prompt.modelSettings.topP,
        // Limit output for preview
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating preview:", error);
    throw error;
  }
}
