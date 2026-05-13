import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

/**
 * Extracts expense information from an image or PDF file using Gemini AI.
 * @param {string} filePath - The path to the file.
 * @param {string} mimeType - The mime type of the file.
 * @returns {Promise<object>} - The extracted expense details.
 */
export const scanBill = async (filePath, mimeType) => {
  try {
    const client = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
    });

    console.log("Using Gemini model: gemini-2.5-flash with @google/genai");

    const prompt = `Analyze this bill/receipt and extract the following information in JSON format:
    {
      "title": "A short, descriptive name for the expense (e.g., store name or service)",
      "amount": "The total amount as a number (e.g., 25.50)",
      "date": "The date of the transaction in YYYY-MM-DD format",
      "category": "The most appropriate category from: Food, Transport, Rent, Utilities, Entertainment, Health, Shopping, Others"
    }
    Only return the JSON. If you cannot find a piece of information, provide a sensible default or an empty string.`;

    const fileData = await fs.readFile(filePath);
    const base64Data = Buffer.from(fileData).toString("base64");

    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType } }
          ]
        }
      ]
    });

    const text = result.candidates[0].content.parts[0].text;
    
    // Clean the JSON string from possible markdown formatting
    const jsonString = text.replace(/```json|```/g, "").trim();
    const extractedData = JSON.parse(jsonString);

    return {
      title: extractedData.title || "New Bill",
      amount: extractedData.amount || "0.00",
      date: extractedData.date || new Date().toISOString().split("T")[0],
      category: extractedData.category || "Others",
      rawText: text
    };
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw new Error("AI failed to read the document. Ensure your API Key is valid.");
  }
};
