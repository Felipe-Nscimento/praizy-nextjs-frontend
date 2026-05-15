import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-zinc-400 hover:text-white transition">
          <Bell size={20} />
        </button>

        <div className="w-10 h-10 rounded-full bg-zinc-700" />
      </div>
    </header>
  );
}