"use server";

import { API_AUTH_URL } from "../constants/URL";

export async function RegisterUser({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}): Promise<
  | {
      message: "User registered successfully";
      user_id: number;
    }
  | {
      error: "User already exists";
    }
  | null
> {
  if (!username || !password || !email) {
    console.error("Missing required fields for registration");
    return null;
  }
  try {
    const response = await fetch(`${API_AUTH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });

    if (!response.ok) {
      console.error("Error from Auth API:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Auth Register error:", error);
    return null;
  }
}

export async function LoginUser({
  password,
  email,
}: {
  password: string;
  email: string;
}): Promise<
  | {
      message: "Login successful";
      token: string;
    }
  | {
      error: "Invalid credentials";
    }
  | null
> {
  if (!password || !email) {
    console.error("Missing required fields for login");
    return null;
  }
  try {
    const response = await fetch(`${API_AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        password,
        email,
      }),
    });

    if (!response.ok) {
      console.error("Error from Auth API:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Auth Login error:", error);
    return null;
  }
}
