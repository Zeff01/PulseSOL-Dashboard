"use client";
import { useEffect, useState } from "react";

type ValidatorData = {
  name: string;
  uptime: number;
  stake: number;
  status: "healthy" | "warning" | "error";
};

export default function EcosystemHealth() {
  const [networkHealth, setNetworkHealth] = useState({
    avgConfirmationTime: 0,
    currentTPS: 0,
    blockTime: 0,
  });

  const [validators] = useState<ValidatorData[]>([
    { name: "Validator A", uptime: 99.9, stake: 1000000, status: "healthy" },
    { name: "Validator B", uptime: 98.5, stake: 800000, status: "healthy" },
    { name: "Validator C", uptime: 95.0, stake: 600000, status: "warning" },
  ]);

  useEffect(() => {
    const fetchNetworkHealth = async () => {
      try {
        const response = await fetch("/api/solana");
        const data = await response.json();

        setNetworkHealth({
          avgConfirmationTime: data.blockTime
            ? Date.now() / 1000 - data.blockTime
            : 0,
          currentTPS: data.tps,
          blockTime: data.blockTime,
        });
      } catch (error) {
        console.error("Error fetching network health:", error);
      }
    };

    fetchNetworkHealth();
    const interval = setInterval(fetchNetworkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">
        Ecosystem Health
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg text-gray-300">Avg. Confirmation Time</h3>
          <p className="text-2xl font-bold text-teal-400">
            {networkHealth.avgConfirmationTime.toFixed(2)}s
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg text-gray-300">Current TPS</h3>
          <p className="text-2xl font-bold text-teal-400">
            {networkHealth.currentTPS.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg text-gray-300">Network Status</h3>
          <p className="text-2xl font-bold text-green-400">Operational</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-teal-400 mb-4">Validator Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validators.map((validator, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-300">
              {validator.name}
            </h4>
            <div className="mt-2">
              <p className="text-gray-400">
                Uptime:{" "}
                <span className={getStatusColor(validator.status)}>
                  {validator.uptime}%
                </span>
              </p>
              <p className="text-gray-400">
                Stake: {validator.stake.toLocaleString()} SOL
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
