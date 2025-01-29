import { useState, useEffect } from "react";
import type { NFTData, NFTResponse } from "@/types/solana";

export function useNFTData(refreshInterval = 30000) {
  const [data, setData] = useState<NFTData | null>(null);
  console.log("NFTData:", data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await fetch("/api/nfts");
        const result = (await response.json()) as NFTResponse;

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result.nfts);
      } catch (err) {
        console.error("Error fetching NFT data:", err);
        setError("Failed to fetch NFT data");
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
