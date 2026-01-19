import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});

export async function generateAiActions({
  situation,
  actions,
}: {
  situation: string;
  actions: string[];
}): Promise<string[]> {
  const existingActionsString = JSON.stringify(actions, null, 2);

  const prompt = `
    Situation:
    ${situation}

    Existing Actions:
    ${existingActionsString}

    Task:
    Generate 2 new, additional actions relevant to the Situation.
    These new actions must be:
    1. Directly relevant to the Situation.
    2. Similar in style and scope to the Existing Actions.
    3. Completely NEW and NOT duplicates of the actions in the "Existing Actions" list.

    Respond ONLY with a valid JSON array of strings containing the new actions.
    Do not add explanations, introductory text, markdown, or any text outside the JSON array.
    
    Example Response: ["New Action 1", "New Action 2", "New Action 3"]
    
    If you cannot generate any new actions, return an empty array [].
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const generatedActions: string[] = JSON.parse(response.text || "[]");

    return generatedActions;
  } catch (error) {
    console.error("Error generating or parsing AI actions:", error);
    return [];
  }
}
