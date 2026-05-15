import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/dashboard/stats-card";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <section className="p-10">
          <h1 className="text-4xl font-bold">
            Bem-vindo ao Praizy
          </h1>

          <p className="text-zinc-400 mt-2">
            Gerencie seu grupo de louvor de forma inteligente
          </p>

          <div className="grid grid-cols-3 gap-6 mt-10">
            <StatsCard
              title="Membros"
              value="24"
            />

            <StatsCard
              title="Músicas"
              value="87"
            />

            <StatsCard
              title="Escalas"
              value="12"
            />
          </div>
        </section>
      </div>
    </main>
  );
}