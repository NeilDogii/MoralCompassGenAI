"use server";

import { AiResponse } from "@/types/AiResponse";
import { API_PREDICTION_URL } from "../constants/URL";

export async function FetchAiResponseTest(): Promise<AiResponse> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    label: "ethical",
    reason: "Simulated for testing purposes.",
  };
}

export async function FetchAiResponse(
  prompt: string
): Promise<AiResponse | null> {
  try {
    const response = await fetch(API_PREDICTION_URL, {
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
