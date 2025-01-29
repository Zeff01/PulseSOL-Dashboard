import { useState, useEffect } from "react";

export function useAIInsights(tps: number, blockTime: number) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setError(null);
        setLoading(true);

        const response = await fetch("/api/ai-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tps, blockTime }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const { insights } = await response.json();
        setInsights(insights);
      } catch (err) {
        console.error("Error fetching AI insights:", err);
        setError("Failed to fetch AI insights");
      } finally {
        setLoading(false);
      }
    };

    if (tps && blockTime) fetchInsights();
  }, [tps, blockTime]);

  return { insights, loading, error };
}
