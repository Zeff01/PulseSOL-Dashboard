"use client";
import { useEffect } from "react";

export default function DebugWebSocket() {
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_QUICKNODE_WSS as string);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error occurred:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket connection closed:", event.reason);
    };

    return () => {
      ws.close();
    };
  }, []);

  return <p>Debugging WebSocket connection...</p>;
}
