"use client";

import {
  //   FetchAiResponse,
  FetchAiResponseTest,
} from "@/lib/requests/FetchAiResponse";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatArea() {
  const [msgHistory, setMsgHistory] = useState<
    { author: "ai" | "user"; message: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading && input.trim() != "") {
      setMsgHistory((prev) => [...prev, { author: "user", message: input }]);
      //   FetchAiResponseTest().then((res) => {
      FetchAiResponseTest().then((res) => {
        setMsgHistory((prev) => [
          ...prev,
          {
            author: "ai",
            message: `The Proved Prompt is *${res.prediction}* Because of the following reason(s)\n Panda reason add kor plij`,
          },
        ]);
        setInput("");
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  return (
    <>
      <div className="h-full overflow-auto">
        <div className="flex flex-col gap-4 p-4">
          {msgHistory.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.author === "ai"
                  ? "self-start bg-background-secondary/90"
                  : "self-end bg-primary/90 text-white"
              } max-w-[70%]  p-3 rounded-lg`}
            >
              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
          {loading && (
            <div className="self-start max-w-[70%] bg-background-secondary/90 p-3 rounded-lg animate-pulse">
              <p className="text-sm text-gray-500">Thinking...</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto min-h-14 p-4 mb-2 flex gap-2 items-center">
        <input
          className="bg-background-secondary/90 w-full rounded-md px-2 py-3 text-sm"
          placeholder="Type your prompt here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-primary p-2.5 cursor-pointer rounded-md hover:bg-primary/90 transition"
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          <Send />
        </button>
      </div>
    </>
  );
}
