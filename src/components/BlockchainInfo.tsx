"use client";
import { useEffect, useState } from "react";

interface BlockchainData {
  slot: number;
  blockTime: number;
  version: {
    "feature-set": number;
    "solana-core": string;
  };
  tps: number;
  epochInfo: {
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    absoluteSlot: number;
    blockHeight: number;
  };
  blockHeight: number;
  health: string;
}

export default function BlockchainInfo() {
  const [data, setData] = useState<BlockchainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/solana");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching blockchain info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const healthColor =
    data.health === "Healthy"
      ? "text-green-400"
      : data.health === "Moderate"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-400">Blockchain Status</h2>
        <span
          className={`px-3 py-1 rounded-full ${healthColor} bg-opacity-20 bg-current`}
        >
          {data.health}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Network Stats */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">
            Network Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current TPS</span>
              <span className="text-white font-medium">
                {data.tps.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Slot</span>
              <span className="text-white font-medium">
                {data.slot.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Block Height</span>
              <span className="text-white font-medium">
                {data.blockHeight.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Block Time</span>
              <span className="text-white font-medium">
                {new Date(data.blockTime * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">
            Version Info
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Solana Core</span>
              <span className="text-white font-medium">
                {data.version["solana-core"]}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Feature Set</span>
              <span className="text-white font-medium">
                {data.version["feature-set"]}
              </span>
            </div>
          </div>
        </div>

        {/* Epoch Info */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">
            Epoch Info
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Epoch</span>
              <span className="text-white font-medium">
                {data.epochInfo.epoch}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Slot Index</span>
              <span className="text-white font-medium">
                {data.epochInfo.slotIndex.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Slots in Epoch</span>
              <span className="text-white font-medium">
                {data.epochInfo.slotsInEpoch.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Absolute Slot</span>
              <span className="text-white font-medium">
                {data.epochInfo.absoluteSlot.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
