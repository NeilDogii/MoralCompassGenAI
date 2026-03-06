"use server";

import { AiResponse } from "@/types/AiResponse";
import { API_PREDICTION_URL } from "../constants/URL";

export async function FetchAiResponseTest(): Promise<AiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    input_text: "Situation: Sample situation. Action: Sample action.",
    layer1_ethics: {
      label: "Ethical",
      scores: {
        ethical: 85.5,
        unethical: 14.5,
      },
    },
    layer2_emotions: [
      { emotion: "neutral", score: 75.5 },
      { emotion: "curiosity", score: 15.2 },
      { emotion: "surprise", score: 9.3 },
    ],
    layer3_policing: {
      policing_index: 72.3,
    },
  };
}

export async function FetchAiResponse(
  situation: string,
  action: string,
  token?: string,
): Promise<AiResponse | null> {
  try {
    const response = await fetch(API_PREDICTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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
