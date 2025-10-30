"use client";
import { Plus } from "lucide-react";

export default function Input({
  situation,
  actions,
  setSituation,
  setActions,
  setLoading,
}: {
  situation: string;
  actions: string[];
  loading?: boolean;
  setSituation: (s: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setActions: any;
  setLoading: (l: boolean) => void;
}) {
  return (
    <section className=" rounded-l-2xl p-4 pl-0 flex flex-col gap-4 h-full">
      <label className="text-sm font-mono text-white/60">Your Situation</label>
      <textarea
        name="situation"
        rows={5}
        className="bg-background-secondary/90 mb-2 w-full rounded-md px-2 py-3 text-sm resize-none"
        placeholder="Type your situation here..."
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
      />
      <label className="text-sm font-mono text-white/60">Your Action(s)</label>
      {actions.map((action, index) => (
        <div key={index} className="flex gap-2 mb-2 items-center">
          <span className="text-sm font-mono text-white/60 -mt-2">
            {index + 1}.
          </span>
          <input
            key={index}
            name="action"
            className="bg-background-secondary/90 mb-2 w-full rounded-md px-2 py-3 text-sm"
            placeholder="Type your actions here..."
            value={action}
            onChange={(e) => {
              setActions((prevActions: string) => {
                const newActions = [...prevActions];
                newActions[index] = e.target.value;
                return newActions;
              });
            }}
          />
        </div>
      ))}
      <div className="w-full flex justify-center">
        <button
          className="flex gap-2 items-center bg-primary p-2.5 cursor-pointer rounded-md hover:bg-primary/90 transition w-fit"
          onClick={() => setActions([...actions, ""])}
        >
          <Plus className="w-4 h-4" />
          Add Another Action
        </button>
      </div>
      <div className="w-full flex justify-center mt-auto">
        <button
          className="flex gap-2 items-center bg-primary p-2.5 cursor-pointer rounded-md hover:bg-primary/90 transition w-fit px-6"
          onClick={() => setLoading(true)}
        >
          Submit
        </button>
      </div>
    </section>
  );
}
