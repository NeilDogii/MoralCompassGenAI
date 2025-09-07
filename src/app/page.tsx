import ChatArea from "@/components/ChatArea";

export default function page() {
  return (
    <section className="w-full max-h-dvh h-dvh grid grid-cols sm:grid sm:grid-cols-[0.9fr_3fr_0.8fr] p-4">
      <div className="max-sm:hidden">Other Options with logo and stuff</div>
      <div className="bg-background-secondary/50 border-white/5 flex flex-col overflow-hidden h-full border-r max-sm:rounded-2xl rounded-l-2xl">
        <div className="border-b-1 border-white/5 min-h-14 py-3 px-4 flex items-center text-lg font-mono">
          Moral Compass
        </div>
        {/* Main Chat area */}
        <ChatArea />
      </div>
      <div className="max-sm:hidden bg-background-secondary/50 rounded-r-2xl">
        History maybe
      </div>
    </section>
  );
}
