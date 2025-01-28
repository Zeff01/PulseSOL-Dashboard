"use client";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

tf.env().set("DEBUG", false);
type Insight = {
  title: string;
  description: string;
};

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        const response = await fetch("/api/solana");
        const result = await response.json();

        const { tps, blockTime } = result;

        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
        model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

        const xs = tf.tensor2d([1000, 1500, 2000, 2500], [4, 1]);
        const ys = tf.tensor2d([1, 2, 3, 4], [4, 1]);

        await model.fit(xs, ys, { epochs: 10 });

        const prediction = model.predict(
          tf.tensor2d([tps], [1, 1])
        ) as tf.Tensor;
        const predictedValue = prediction.dataSync()[0];

        const generatedInsights: Insight[] = [
          {
            title: "Predicted TPS Trend",
            description: `Based on the current activity, the TPS trend is predicted to be at level ${predictedValue.toFixed(
              2
            )}.`,
          },
        ];

        if (tps > 2000) {
          generatedInsights.push({
            title: "High TPS Activity",
            description: `The network is experiencing high activity with ${tps} transactions per second.`,
          });
        }

        if (blockTime > 1) {
          generatedInsights.push({
            title: "Block Time Increase",
            description: `Block confirmation time has risen to ${blockTime.toFixed(
              2
            )} seconds.`,
          });
        }

        setInsights(generatedInsights);
      } catch (error) {
        console.error("Error generating AI insights:", error);
      }
    };

    generateInsights();
  }, []);

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">AI Insights</h2>
      <ul className="list-disc pl-6 space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="text-gray-300">
            <strong className="text-teal-400">{insight.title}: </strong>
            {insight.description}
          </li>
        ))}
      </ul>
    </section>
  );
}
