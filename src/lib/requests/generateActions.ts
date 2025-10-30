import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
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
  // Convert the existing actions array into a string for the prompt
  const existingActionsString = JSON.stringify(actions, null, 2);

  // Define the system instruction and prompt for the AI
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
    // Call the AI model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Or your preferred model
      contents: prompt,
      config: {
        // This strongly encourages the model to output valid JSON
        responseMimeType: "application/json",
        // You can also adjust temperature for more/less creative actions
        // temperature: 0.7
      },
    });

    // Parse the JSON string from the AI's response text
    // The response.text should be a string like: ["action1", "action2"]
    const generatedActions: string[] = JSON.parse(response.text || "[]");

    return generatedActions;
  } catch (error) {
    console.error("Error generating or parsing AI actions:", error);
    // console.error("AI Response Text (if available):", error.response?.text);
    // Return an empty array on failure to maintain type safety
    return [];
  }
}

// --- Example Usage (requires an 'ai' object) ---

/*
// This is how you might use it (assuming 'ai' is configured)

const mySituation = "A user is trying to log in to their account but has forgotten their password.";
const myActions = [
  "Show a 'Forgot Password' link",
  "Ask for their email address",
  "Send a password reset email"
];

generateAiActions({ situation: mySituation, actions: myActions })
  .then(newActions => {
    console.log("Generated new actions:");
    console.log(newActions);
    // Example Output might be:
    // [
    //   "Offer login via SMS code",
    //   "Ask security questions",
    //   "Provide a link to customer support",
    //   "Display a 'Try again' button",
    //   "Lock account after 5 failed attempts"
    // ]
  })
  .catch(console.error);

*/
