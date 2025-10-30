"use client";

import {
  FetchAiResponse,
  // FetchAiResponseTest,
} from "@/lib/requests/FetchAiResponse";
import { Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function ChatArea() {
  const [msgHistory, setMsgHistory] = useState<
    { author: "ai" | "user"; message: string }[]
  >([]);
  const [situation, setSituation] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!situation.trim()) return;
    if (action.trim() == "") return;
    if (loading && situation.trim() != "") {
      setMsgHistory((prev) => [
        ...prev,
        {
          author: "user",
          message: `Situation: ${situation}\nAction: ${action}`,
        },
      ]);
      //   FetchAiResponseTest().then((res) => {
      FetchAiResponse(situation, action).then((res) => {
        if (res) {
          setMsgHistory((prev) => [
            ...prev,
            {
              author: "ai",
              message: `Layer 1: ${res.layer1}\nLayer 2: ${res.layer2}`,
            },
          ]);
        }
      });
      setSituation("");
      setAction("");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgHistory]);
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
              {msg.message.split("\n").map((line, i) => (
                <p key={i} className="text-sm">
                  {line}
                </p>
              ))}
            </div>
          ))}
          {loading && (
            <div className="self-start max-w-[70%] bg-background-secondary/90 p-3 rounded-lg animate-pulse">
              <p className="text-sm text-gray-500">Thinking...</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="mt-auto min-h-14 p-4 mb-2 flex gap-2 items-center">
        <div className="flex flex-col w-full">
          <input
            className="bg-background-secondary/90 mb-2 w-full rounded-md px-2 py-3 text-sm"
            placeholder="Type your situation here..."
            value={situation}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setLoading(true);
              }
            }}
            onChange={(e) => setSituation(e.target.value)}
          />
          <input
            className="bg-background-secondary/90 w-full rounded-md px-2 py-3 text-sm"
            placeholder="Type your Action here..."
            value={action}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setLoading(true);
              }
            }}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>
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
