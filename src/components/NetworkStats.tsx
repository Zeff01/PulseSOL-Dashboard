"use client";
"use client";
import { useEffect, useState } from "react";

interface NetworkData {
  slot: number;
  blockTime: number;
  tps: number;
  health: string;
  epochInfo: {
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
  };
}

export default function NetworkStats() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/solana");
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching network stats:", err);
        setError("Failed to load network statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="text-red-400 p-4 bg-gray-700 rounded">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const healthColor =
    data.health === "Healthy"
      ? "text-green-400"
      : data.health === "Moderate"
      ? "text-yellow-400"
      : "text-red-400";

  const epochProgress =
    (data.epochInfo.slotIndex / data.epochInfo.slotsInEpoch) * 100;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">
        Network Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">
            Performance
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Network Health</span>
              <span className={`font-medium ${healthColor}`}>
                {data.health}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current TPS</span>
              <span className="text-white font-medium">
                {data.tps.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Block Time</span>
              <span className="text-white font-medium">
                {new Date(data.blockTime * 1000).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Epoch Information */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">
            Epoch Progress
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Epoch</span>
              <span className="text-white font-medium">
                {data.epochInfo.epoch}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slot Progress</span>
              <span className="text-white font-medium">
                {data.epochInfo.slotIndex.toLocaleString()} /{" "}
                {data.epochInfo.slotsInEpoch.toLocaleString()}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completion</span>
                <span className="text-white font-medium">
                  {epochProgress.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-teal-400 h-2 rounded-full"
                  style={{ width: `${epochProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
