"use client";

import React from "react";
import { 
  Activity, Zap, Smile, Target, AlertTriangle, Clock, 
  BarChart3, MessageSquare, Tag
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

type DashboardData = {
  overview: {
    total: number;
    containmentRate: number;
    satisfactionRate: number;
    precisionRate: number;
    churnRiskCount: number;
    churnRiskRate: number;
    avgLatencyMs: number;
    avgSentimentScore: number;
  };
  topIntents: { intent: string; count: number }[];
  sentiments: { sentiment: string; count: number }[];
  modelComparison: {
    version: string;
    interactions: number;
    interactionShare: number;
    avgLatency: number;
    avgTokens: number;
    containmentRate: number;
  }[];
};

const INTENT_COLORS = ["#6366f1", "#ef4444", "#10b981", "#06b6d4", "#f59e0b"];
const SENTIMENT_COLORS: Record<string, string> = {
  "Positivo": "#10b981",
  "Neutral": "#f59e0b",
  "Negativo": "#ef4444"
};

export default function ModelDashboard({ data }: { data: DashboardData }) {
  const { overview, topIntents, sentiments, modelComparison } = data;

  const totalSentiments = sentiments.reduce((acc, s) => acc + s.count, 0) || 1;
  const getSentimentPercent = (type: string) => {
    const s = sentiments.find(x => x.sentiment === type);
    return s ? ((s.count / totalSentiments) * 100).toFixed(1) : "0.0";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-800 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-sm font-semibold tracking-wider text-purple-600 uppercase">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span>Omniserve Call Center (nombre ficticio para demo)</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Dashboard Ejecutivo
            </span>
            {" - Datos Sintéticos"}
          </h1>
          <p className="text-slate-500 font-medium">Análisis en tiempo real del rendimiento conversacional</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
            {new Date().toLocaleDateString("es-ES")} - {new Date().toLocaleTimeString("es-ES", {hour: '2-digit', minute:'2-digit'})}
          </div>
          <div className="px-4 py-2 bg-emerald-500 rounded-full text-sm font-bold text-white flex items-center space-x-2 shadow-sm shadow-emerald-200">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW CARDS (PAGE 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500 mb-4">
            <BarChart3 size={20} />
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Total Interacciones</div>
          <div className="text-4xl font-black text-indigo-500 mb-2">{overview.total}</div>
          <p className="text-sm text-slate-500 mb-4">Consultas procesadas {new Date().toLocaleDateString("es-ES")}</p>
          <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md">↑ 100% activo</div>
        </div>

        {/* Card 2: Contencion */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 mb-4">
            <Zap size={20} />
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Tasa de Contención</div>
          <div className="text-4xl font-black text-orange-500 mb-2">{overview.containmentRate.toFixed(1)}%</div>
          <p className="text-sm text-slate-500 mb-4">Resuelto sin escalamiento</p>
          <div className="inline-block px-2 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-md">⚠ Mejorable</div>
        </div>

        {/* Card 3: Satisfaccion */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500 mb-4">
            <Smile size={20} />
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Satisfacción</div>
          <div className="text-4xl font-black text-emerald-500 mb-2">{overview.satisfactionRate.toFixed(1)}%</div>
          <p className="text-sm text-slate-500 mb-4">Feedback positivo</p>
          <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md">
            ↑ {sentiments.find(s=>s.sentiment === "Positivo")?.count || 0} 👍 vs {sentiments.find(s=>s.sentiment === "Negativo")?.count || 0} 👎
          </div>
        </div>

        {/* Card 4: Precision IA */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-500 mb-4">
            <Target size={20} />
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Precisión IA</div>
          <div className="text-4xl font-black text-teal-500 mb-2">{overview.precisionRate.toFixed(1)}%</div>
          <p className="text-sm text-slate-500 mb-4">Detección correcta de intención</p>
          <div className="inline-block px-2 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-md">↑ Excelente</div>
        </div>

        {/* Card 5: Riesgo Churn */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={20} />
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Riesgo de Churn</div>
          <div className="text-4xl font-black text-red-500 mb-2">{overview.churnRiskRate.toFixed(0)}%</div>
          <p className="text-sm text-slate-500 mb-4">{overview.churnRiskCount} clientes en riesgo</p>
          <div className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md">↓ Atención inmediata</div>
        </div>

        {/* Card 6: Latencia */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 mb-4">
            <Clock size={20} />
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Latencia Promedio</div>
          <div className="text-4xl font-black text-pink-500 mb-2">{overview.avgLatencyMs}ms</div>
          <p className="text-sm text-slate-500 mb-4">Tiempo de respuesta</p>
          <div className="inline-block px-2 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-md">⚡ Optimizable</div>
        </div>
      </div>

      {/* CHARTS SECTION (PAGE 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Intents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Top 5 Intenciones de Usuario</h3>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <Tag size={16} />
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topIntents} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="intent" type="category" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 12, fontWeight: 600}} width={120} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {topIntents.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={INTENT_COLORS[index % INTENT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Distribución Sentimiento</h3>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="space-y-6 mt-4">
            {['Negativo', 'Neutral', 'Positivo'].map((type) => {
              const pct = getSentimentPercent(type);
              const color = SENTIMENT_COLORS[type];
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm font-bold mb-2 text-slate-700">
                    <span>{type}</span>
                    <span style={{ color }}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full" 
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <p className="text-sm font-bold text-slate-600">
              Score promedio: <span className="text-indigo-600">{(overview.avgSentimentScore > 0 ? "+" : "") + overview.avgSentimentScore.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* MODEL COMPARISON (PAGE 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modelComparison.map((model) => {
          const isAdvanced = model.version.includes("v2");
          return (
            <div key={model.version} className={`bg-white rounded-2xl p-6 shadow-sm border ${isAdvanced ? 'border-indigo-100 ring-1 ring-indigo-50' : 'border-slate-100'} relative overflow-hidden`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{model.version}</h3>
                {isAdvanced ? (
                  <span className="px-3 py-1 bg-fuchsia-600 text-white text-xs font-bold rounded-full">RECOMENDADO</span>
                ) : (
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">DEPRECADO</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 tracking-wider mb-1">INTERACCIONES</p>
                  <p className="text-2xl font-black text-fuchsia-600">{model.interactions} <span className="text-sm font-medium text-slate-500">{model.interactionShare.toFixed(1)}%</span></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 tracking-wider mb-1">LATENCIA</p>
                  <p className="text-2xl font-black text-fuchsia-600">{model.avgLatency} <span className="text-sm font-medium text-slate-500">ms</span></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 tracking-wider mb-1">CONTENCIÓN</p>
                  <p className="text-2xl font-black text-fuchsia-600">{model.containmentRate.toFixed(1)} <span className="text-sm font-medium text-slate-500">%</span></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 tracking-wider mb-1">TOKENS AVG</p>
                  <p className="text-2xl font-black text-fuchsia-600">{model.avgTokens} <span className="text-sm font-medium text-slate-500">tkn</span></p>
                </div>
              </div>

              {isAdvanced ? (
                <div className="bg-indigo-50/50 p-4 rounded-xl border-l-4 border-indigo-500 text-sm text-slate-600">
                  ✓ Rendimiento superior en velocidad y contención. Ideal para producción de alto volumen en OmniServe.
                </div>
              ) : (
                <div className="bg-red-50/50 p-4 rounded-xl border-l-4 border-red-500 text-sm text-slate-600">
                  ⚠ Latencia {((model.avgLatency / (modelComparison.find(m=>m.version.includes("v2"))?.avgLatency || 1))).toFixed(1)}x mayor y baja contención. Migrar a v2-Advanced urgente para reducir costos operacionales.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* STRATEGIC RECOMMENDATIONS (PAGE 4) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center text-white">
            <Target size={20} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Recomendaciones Estratégicas</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl relative overflow-hidden flex flex-col justify-center bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <h4 className="font-bold text-slate-900">Riesgo de Churn Elevado</h4>
            </div>
            <p className="text-sm text-slate-600 ml-4">{overview.churnRiskCount} clientes ({overview.churnRiskRate.toFixed(0)}%) muestran señales de cancelación. Implementar protocolo de retención inmediato.</p>
          </div>

          <div className="p-4 rounded-xl relative overflow-hidden flex flex-col justify-center bg-amber-50 border-l-4 border-amber-500">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <h4 className="font-bold text-slate-900">Migración a v2-Advanced Urgente</h4>
            </div>
            <p className="text-sm text-slate-600 ml-4">v1-Legacy consume más tokens y tiene mayor latencia. ROI estimado 45% reducción de costos operacionales.</p>
          </div>

          <div className="p-4 rounded-xl relative overflow-hidden flex flex-col justify-center bg-indigo-50 border-l-4 border-indigo-500">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <h4 className="font-bold text-slate-900">Oportunidad: {topIntents.find(i => i.intent === "Disputas Cobro")?.count || 27} Disputas de Cobro</h4>
            </div>
            <p className="text-sm text-slate-600 ml-4">Alto volumen de reclamos financieros. Revisar proceso de facturación y automatizar resoluciones para mejorar experiencia.</p>
          </div>

          <div className="p-4 rounded-xl relative overflow-hidden flex flex-col justify-center bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <h4 className="font-bold text-slate-900">Potencial de Ventas: {topIntents.find(i => i.intent === "Upgrade/Ventas")?.count || 33} Oportunidades de Upgrade</h4>
            </div>
            <p className="text-sm text-slate-600 ml-4">Interés activo en mejoras de servicio y planes premium. Activar campañas de upselling dirigidas para maximizar ARPU.</p>
          </div>

          <div className="p-4 rounded-xl relative overflow-hidden flex flex-col justify-center bg-orange-50 border-l-4 border-orange-500">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h4 className="font-bold text-slate-900">Tasa de Contención {overview.containmentRate.toFixed(1)}%</h4>
            </div>
            <p className="text-sm text-slate-600 ml-4">Meta objetivo: 75%. Optimizar respuestas automáticas y entrenar modelo con casos escalados para reducir intervención humana.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
