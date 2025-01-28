import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

interface NFTData {
  name: string;
  image: string;
  collection: string;
  mintAddress: string;
}

interface NFTResponse {
  nfts: NFTData[];
  error?: string;
}

let cachedNFTs: NFTResponse | null = null;
let lastNFTFetchTime = 0;
const NFT_CACHE_DURATION = 60000;

export async function GET() {
  const now = Date.now();

  if (cachedNFTs && now - lastNFTFetchTime < NFT_CACHE_DURATION) {
    return NextResponse.json(cachedNFTs);
  }

  const connection = new Connection(
    process.env.NEXT_PUBLIC_QUICKNODE_HTTP as string
  );

  try {
    const METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    const signatures = await connection.getSignaturesForAddress(
      METADATA_PROGRAM_ID,
      { limit: 6 }
    );

    const nfts: NFTData[] = signatures.map((sig, index) => ({
      name: `NFT Collection #${index + 1}`,
      image: `/api/placeholder/300/200`,
      collection: `Collection ${String.fromCharCode(65 + index)}`,
      mintAddress: sig.signature,
    }));

    cachedNFTs = { nfts };
    lastNFTFetchTime = now;

    return NextResponse.json(cachedNFTs);
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    const errorResponse: NFTResponse = {
      nfts: [],
      error: "Failed to fetch NFT data",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
