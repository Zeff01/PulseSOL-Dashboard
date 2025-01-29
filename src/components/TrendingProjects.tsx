"use client";
import { useSolanaData } from "@/hooks/useSolanaData";
import { useNFTData } from "@/hooks/useNFTData";

export default function TrendingProjects() {
  const {
    data: solanaData,
    loading: solanaLoading,
    error: solanaError,
  } = useSolanaData();
  const { data: nftData, loading: nftLoading, error: nftError } = useNFTData();

  if (solanaLoading || nftLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (solanaError || nftError) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="text-red-400 p-4 bg-gray-700 rounded">
          {solanaError || nftError}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-8">
      {/* Blockchain Health */}
      {solanaData && (
        <div>
          <h2 className="text-2xl font-bold text-teal-400 mb-4">
            Blockchain Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Current Slot</p>
              <p className="text-lg font-semibold text-white">
                {solanaData.slot}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">TPS</p>
              <p className="text-lg font-semibold text-white">
                {solanaData.tps}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Blockchain Health</p>
              <p className="text-lg font-semibold text-teal-400">
                {solanaData.health}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* NFT Collections */}
      {nftData?.collections && nftData.collections.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-teal-400 mb-4">
            Top NFT Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nftData.collections.map((collection, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">
                    {collection.name}
                  </h3>
                  <span className="text-sm text-teal-400">
                    {collection.items} items
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Floor Price</span>
                    <span className="text-white">
                      {collection.floorPrice.toFixed(2)} SOL
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="text-white">
                      {collection.volume24h.toFixed(2)} SOL
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales */}
      {nftData?.recentSales && nftData.recentSales.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-teal-400 mb-4">
            Recent Sales
          </h2>
          <div className="space-y-3">
            {nftData.recentSales.map((sale, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{sale.collection}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(sale.time * 1000).toLocaleString()}
                  </p>
                </div>
                <span className="text-teal-400 font-bold">
                  {sale.price.toFixed(2)} SOL
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
