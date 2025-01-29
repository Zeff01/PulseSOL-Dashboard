import { useState, useEffect } from "react";
import type { SolanaData, APIErrorResponse } from "@/types/solana";

let cachedData: SolanaData | null = null;
let lastFetchTime = 0;

export function useSolanaData(refreshInterval = 5000) {
  const [data, setData] = useState<SolanaData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = Date.now();
        if (cachedData && now - lastFetchTime < refreshInterval) {
          setData(cachedData);
          return;
        }

        setError(null);
        setLoading(true);
        const response = await fetch("/api/solana");
        const result = (await response.json()) as SolanaData | APIErrorResponse;

        if ("error" in result) {
          throw new Error(result.error);
        }

        cachedData = result;
        lastFetchTime = Date.now();
        setData(result);
      } catch (err) {
        console.error("Error fetching Solana data:", err);
        setError("Failed to fetch blockchain data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
}
