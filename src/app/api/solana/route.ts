import { NextResponse } from "next/server";
import { Connection, Version, EpochInfo } from "@solana/web3.js";

interface SolanaData {
  slot: number;
  blockTime: number | null;
  version: Version;
  tps: number;
  epochInfo: EpochInfo;
  blockHeight: number;
  health: "Healthy" | "Moderate" | "Degraded";
}

interface ErrorResponse {
  error: string;
}

let cachedData: SolanaData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000;

export async function GET(): Promise<NextResponse<SolanaData | ErrorResponse>> {
  try {
    const now = Date.now();

    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    const rpcEndpoint = process.env.NEXT_PUBLIC_QUICKNODE_HTTP;
    if (!rpcEndpoint) {
      console.error("NEXT_PUBLIC_QUICKNODE_HTTP is not defined");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Initialize connection
    const connection = new Connection(rpcEndpoint);

    // Fetch data
    const [slot, version, performanceSamples, epochInfo, blockHeight] =
      await Promise.all([
        connection.getSlot(),
        connection.getVersion(),
        connection.getRecentPerformanceSamples(1),
        connection.getEpochInfo(),
        connection.getBlockHeight(),
      ]);

    const blockTime = await connection.getBlockTime(slot);

    // Calculate TPS
    const tps = performanceSamples[0]
      ? performanceSamples[0].numTransactions /
        performanceSamples[0].samplePeriodSecs
      : 0;

    // Check health based on performance
    const health = tps > 1000 ? "Healthy" : tps > 500 ? "Moderate" : "Degraded";

    // Create response data with type safety
    cachedData = {
      slot,
      blockTime,
      version,
      tps,
      epochInfo,
      blockHeight,
      health,
    } as SolanaData;

    lastFetchTime = now;

    console.log("Solana API Response:", cachedData);

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error("Solana API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Solana data" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
