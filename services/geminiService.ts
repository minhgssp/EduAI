import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google Gemini AI client with the API key from environment variables.
// As per guidelines, we assume process.env.API_KEY is pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Calls the Gemini API to generate content based on a prompt.
 * @param prompt The prompt to send to the model.
 * @returns The generated text content.
 */
export const callGemini = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            // Using a fast and capable model suitable for instructional design tasks.
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        // Use the recommended .text accessor to get the string output directly.
        const text = response.text;
        
        if (!text) {
            throw new Error("Received an empty response from the AI.");
        }
        
        return text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Provide a more user-friendly error message to be displayed in the UI.
        throw new Error("An error occurred while communicating with the AI. Please try again.");
    }
};

/**
 * Calls the Gemini API with a specific response schema to get structured JSON output.
 * @param prompt The prompt to send to the model.
 * @param schema The response schema for the expected JSON output.
 * @returns The parsed JSON object.
 */
export const callGeminiWithSchema = async <T>(prompt: string, schema: any): Promise<T> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("Received an empty JSON response from the AI.");
        }

        // The response text is a JSON string that needs to be parsed.
        return JSON.parse(text) as T;

    } catch (error) {
        console.error("Error calling Gemini API with schema:", error);
         if (error instanceof SyntaxError) {
            throw new Error("The AI returned invalid JSON. Please try regenerating.");
        }
        throw new Error("An error occurred while generating structured content. Please try again.");
    }
};