"use server";

import { AiResponse } from "@/types/AiResponse";

export async function FetchAiResponseTest(): Promise<AiResponse> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    prediction: "ethical",
    reason: "Simulated for testing purposes.",
  };
}

export async function FetchAiResponse(
  prompt: string
): Promise<AiResponse | null> {
  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: prompt,
      }),
    });

    if (!response.ok) {
      console.error("Error from GenAi API:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data as AiResponse;
  } catch (error) {
    console.error("FetchAiResponse error:", error);
    return null;
  }
}
