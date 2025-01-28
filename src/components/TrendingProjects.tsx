"use client";
import { useEffect, useState } from "react";

interface NetworkActivity {
  slot: number;
  blockTime: number;
  tps: number;
  blockHeight: number;
  epochInfo: {
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    absoluteSlot: number;
    blockHeight: number;
  };
  health: string;
  version: {
    "feature-set": number;
    "solana-core": string;
  };
}

export default function TrendingProjects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NetworkActivity | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/solana");
        const result = await response.json();
        setData(result);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load network data");
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
      <section className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-red-400 p-4 bg-gray-700 rounded">{error}</div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-400">
          Network Activity Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <span
            className={`h-2 w-2 rounded-full ${
              data.health === "Healthy" ? "bg-green-400" : "bg-yellow-400"
            }`}
          ></span>
          <span className="text-sm text-gray-400">{data.health}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* TPS Card */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-2">
            Transaction Speed
          </h3>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold text-white">
              {data.tps.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400">TPS</span>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Transactions per second
          </div>
        </div>

        {/* Block Info Card */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-2">
            Latest Block
          </h3>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold text-white">
              {data.blockHeight.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400">Height</span>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Current slot: {data.slot.toLocaleString()}
          </div>
        </div>

        {/* Epoch Progress Card */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-2">
            Epoch Progress
          </h3>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold text-white">
              {data.epochInfo.epoch}
            </span>
            <span className="text-sm text-gray-400">Current Epoch</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-teal-400 h-2 rounded-full"
                style={{
                  width: `${
                    (data.epochInfo.slotIndex / data.epochInfo.slotsInEpoch) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-teal-300 mb-3">
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">Solana Core Version:</span>
            <span className="text-white ml-2">
              {data.version["solana-core"]}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Feature Set:</span>
            <span className="text-white ml-2">
              {data.version["feature-set"]}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Last Block Time:</span>
            <span className="text-white ml-2">
              {new Date(data.blockTime * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
