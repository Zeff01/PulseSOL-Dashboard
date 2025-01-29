"use client";
import { useSolanaData } from "@/hooks/useSolanaData";

export default function EnhancedMetrics() {
  const { data, loading, error } = useSolanaData();

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">Network Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="TPS"
          value={data.tps.toFixed(2)}
          subtitle="Transactions per second"
        />
        <MetricCard
          title="Current Slot"
          value={data.slot.toLocaleString()}
          subtitle="Latest block slot"
        />
        <MetricCard
          title="Block Height"
          value={data.blockHeight.toLocaleString()}
          subtitle="Current height"
        />
        <MetricCard
          title="Network Status"
          value={data.health}
          subtitle="Network health"
          valueColor={
            data.health === "Healthy"
              ? "text-green-400"
              : data.health === "Moderate"
              ? "text-yellow-400"
              : "text-red-400"
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">
            Version Info
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Solana Core</span>
              <span className="text-white">{data.version["solana-core"]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Feature Set</span>
              <span className="text-white">{data.version["feature-set"]}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">
            Epoch Info
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Epoch</span>
              <span className="text-white">{data.epochInfo.epoch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slot Index</span>
              <span className="text-white">{data.epochInfo.slotIndex}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  valueColor = "text-white",
}: {
  title: string;
  value: string;
  subtitle: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className={`text-2xl font-bold ${valueColor} mt-1`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
