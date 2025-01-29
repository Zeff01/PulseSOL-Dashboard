"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useSolanaData } from "@/hooks/useSolanaData";

interface TPSData {
  timestamp: number;
  tps: number;
}

export default function TPSChart() {
  const { data: solanaData, loading, error } = useSolanaData();
  const [tpsHistory, setTPSHistory] = useState<TPSData[]>([]);

  useEffect(() => {
    if (solanaData?.tps) {
      setTPSHistory((prev) => {
        const newData = [
          ...prev,
          {
            timestamp: Date.now(),
            tps: solanaData.tps,
          },
        ];

        return newData.slice(-20);
      });
    }
  }, [solanaData]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-700 rounded"></div>
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

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">
        Transactions Per Second (TPS)
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={tpsHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "0.5rem",
                color: "#D1D5DB",
              }}
              labelFormatter={formatTime}
            />
            <Line
              type="monotone"
              dataKey="tps"
              stroke="#14F195"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
