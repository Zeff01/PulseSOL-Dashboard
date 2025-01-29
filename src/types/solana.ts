import { Version, EpochInfo } from "@solana/web3.js";

export interface SolanaData {
  slot: number;
  blockTime: number | null;
  version: Version;
  tps: number;
  epochInfo: EpochInfo;
  blockHeight: number;
  health: NetworkHealth;
}

export type NetworkHealth = "Healthy" | "Moderate" | "Degraded";

export interface TokenData {
  name: string;
  symbol: string;
  volume24h: number;
  price: number;
  change24h: number;
}

export interface NFTCollection {
  name: string;
  floorPrice: number;
  volume24h: number;
  items: number;
}

export interface NFTSale {
  collection: string;
  price: number;
  time: number;
  tokenId: string;
}

export interface NFTData {
  collections: NFTCollection[];
  recentSales: NFTSale[];
}

export interface APIErrorResponse {
  error: string;
}

export interface NFTResponse {
  nfts: NFTData;
  error?: string;
}

export interface PerformanceStats {
  numTransactions: number;
  numSlots: number;
  samplePeriodSecs: number;
}

export interface ValidatorData {
  nodePubkey: string;
  activatedStake: number;
  lastVote: number;
  commission: number;
}

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  valueColor?: string;
}

export interface LoadingProps {
  message?: string;
}

export interface ErrorProps {
  message: string;
}

export interface WebSocketMessage {
  type: "block" | "transaction" | "slot";
  data: unknown;
}

export interface TokenStats {
  address: string;
  symbol: string;
  name: string;
  price: number;
  volume24h: number;
  change24h: number;
  totalSupply: number;
  holders: number;
  priceChange24h: number;
}
