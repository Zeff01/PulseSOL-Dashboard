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

interface TPSData {
  timestamp: number;
  tps: number;
}

export default function TPSChart() {
  const [tpsHistory, setTPSHistory] = useState<TPSData[]>([]);

  useEffect(() => {
    const fetchTPSData = async () => {
      try {
        const response = await fetch("/api/solana");
        const result = await response.json();

        setTPSHistory((prev) => {
          const newData = [
            ...prev,
            {
              timestamp: Date.now(),
              tps: result.tps,
            },
          ];

          return newData.slice(-20);
        });
      } catch (error) {
        console.error("Error fetching TPS data:", error);
      }
    };

    fetchTPSData();
    const interval = setInterval(fetchTPSData, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

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
