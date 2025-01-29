import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import type { NFTResponse, NFTData } from "@/types/solana";

let cachedNFTs: NFTResponse | null = null;
let lastNFTFetchTime = 0;
const NFT_CACHE_DURATION = 60000;

export async function GET(): Promise<NextResponse<NFTResponse>> {
  const now = Date.now();

  if (cachedNFTs && now - lastNFTFetchTime < NFT_CACHE_DURATION) {
    return NextResponse.json(cachedNFTs);
  }

  const connection = new Connection(
    process.env.NEXT_PUBLIC_QUICKNODE_HTTP as string
  );

  try {
    // Fetch recent NFT program signatures
    const METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    const signatures = await connection.getSignaturesForAddress(
      METADATA_PROGRAM_ID,
      { limit: 10 }
    );

    // Create simulated NFT data based on signatures
    const nftData: NFTData = {
      collections: signatures.slice(0, 5).map((sig, index) => ({
        name: `Collection ${index + 1}`,
        floorPrice: Math.random() * 10,
        volume24h: Math.random() * 1000,
        items: Math.floor(Math.random() * 10000),
      })),
      recentSales: signatures.slice(0, 5).map((sig, index) => ({
        collection: `Collection ${index + 1}`,
        price: Math.random() * 10,
        time: Date.now() / 1000 - index * 3600,
        tokenId: sig.signature,
      })),
    };

    cachedNFTs = { nfts: nftData };
    lastNFTFetchTime = now;

    return NextResponse.json(cachedNFTs);
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return NextResponse.json({
      nfts: { collections: [], recentSales: [] },
      error: "Failed to fetch NFT data",
    });
  }
}
