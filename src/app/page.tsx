import React from "react";
import ModelDashboard from "@/components/ModelDashboard";
import { getModelDashboardData } from "@/lib/model-data";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getModelDashboardData();

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center p-6 bg-[#F4F7FB]">
        <h1 className="text-2xl font-bold">No hay datos de interacción del modelo en la base de datos compartida. Por favor, asegúrate de que el dashboard principal haya sembrado los datos (db push / seed).</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <ModelDashboard data={data} />
    </main>
  );
}
