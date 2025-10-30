"use server";

import { AiResponse } from "@/types/AiResponse";
import { API_PREDICTION_URL } from "../constants/URL";

export async function FetchAiResponseTest(): Promise<AiResponse> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    layer1: "Sample Layer 1",
    layer2: "Sample Layer 2",
    text: "This is a sample AI response text.",
  };
}

export async function FetchAiResponse(
  situation: string,
  action: string
): Promise<AiResponse | null> {
  try {
    const response = await fetch(API_PREDICTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        situation,
        action,
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
