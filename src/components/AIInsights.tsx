"use client";

import { useSolanaData } from "@/hooks/useSolanaData";
import { useAIInsights } from "@/hooks/useAIInsights";

export default function AIInsights() {
  const {
    data: solanaData,
    loading: solanaLoading,
    error: solanaError,
  } = useSolanaData();
  const {
    insights,
    loading: insightsLoading,
    error: insightsError,
  } = useAIInsights(solanaData?.tps || 0, solanaData?.blockTime || 0);

  if (solanaLoading || insightsLoading) {
    return (
      <section className="bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">AI Insights</h2>
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </section>
    );
  }

  if (solanaError || insightsError) {
    return (
      <section className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">AI Insights</h2>
        <p className="text-red-400">{solanaError || insightsError}</p>
      </section>
    );
  }

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">AI Insights</h2>
      <ul className="list-disc pl-6 space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="text-gray-300">
            {insight}
          </li>
        ))}
      </ul>
    </section>
  );
}
