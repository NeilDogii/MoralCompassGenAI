"use client";
import { useState } from "react";
import ChatArea from "@/components/ChatArea";
import Input from "@/components/Input";

export default function Wrapper() {
  const [situation, setSituation] = useState("");
  const [actions, setActions] = useState([""]);
  const [loading, setLoading] = useState(false);

  return (
    <section className="w-full max-h-dvh h-dvh grid grid-cols sm:grid sm:grid-cols-[1fr_3fr] p-4">
      <Input
        actions={actions}
        situation={situation}
        setActions={setActions}
        setSituation={setSituation}
        setLoading={setLoading}
      />
      <div className="bg-background-secondary/50 border-white/5 flex flex-col overflow-hidden h-full border-r max-sm:rounded-2xl rounded-l-2xl">
        <div className="border-b-1 border-white/5 min-h-14 py-3 px-4 flex items-center text-lg font-mono">
          Moral Compass
        </div>
        {/* Main Chat area */}
        <ChatArea
          action={actions}
          situation={situation}
          loading={loading}
          setSituation={setSituation}
          setAction={setActions}
          setLoading={setLoading}
        />
      </div>
    </section>
  );
}
