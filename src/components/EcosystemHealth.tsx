"use client";
import { useSolanaData } from "@/hooks/useSolanaData";

type ValidatorData = {
  name: string;
  uptime: number;
  stake: number;
  status: "healthy" | "warning" | "error";
};

export default function EcosystemHealth() {
  const { data: solanaData, loading, error } = useSolanaData();

  const validators: ValidatorData[] = [
    { name: "Validator A", uptime: 99.9, stake: 1000000, status: "healthy" },
    { name: "Validator B", uptime: 98.5, stake: 800000, status: "healthy" },
    { name: "Validator C", uptime: 95.0, stake: 600000, status: "warning" },
  ];

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

  if (loading) {
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

  if (error || !solanaData) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="text-red-400 p-4 bg-gray-700 rounded">
          {error || "Failed to load data"}
        </div>
      </div>
    );
  }

  const avgConfirmationTime = solanaData.blockTime
    ? Date.now() / 1000 - solanaData.blockTime
    : 0;

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">
        Ecosystem Health
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg text-gray-300">Avg. Confirmation Time</h3>
          <p className="text-2xl font-bold text-teal-400">
            {avgConfirmationTime.toFixed(2)}s
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg text-gray-300">Current TPS</h3>
          <p className="text-2xl font-bold text-teal-400">
            {solanaData.tps.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg text-gray-300">Network Status</h3>
          <p className="text-2xl font-bold text-green-400">
            {solanaData.health}
          </p>
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
