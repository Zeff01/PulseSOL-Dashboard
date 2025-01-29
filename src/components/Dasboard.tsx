import TPSChart from "./TPSChart";
import TrendingProjects from "./TrendingProjects";
import EcosystemHealth from "./EcosystemHealth";

import EnhancedMetrics from "./EnhancedMetrics";
import NetworkStats from "./NetworkStats";
import BlockchainInfo from "./BlockchainInfo";
import { ErrorBoundary } from "./ErrorBoundary";
import AIInsights from "./AIInsights";

export default function Dashboard() {
  return (
    <div className="md:p-6 md:space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-teal-400">
          PulseSOL Dashboard
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          Real-time insights into the Solana blockchain
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <ErrorBoundary>
          <AIInsights />
        </ErrorBoundary>
        <ErrorBoundary>
          <EnhancedMetrics />
        </ErrorBoundary>
        <ErrorBoundary>
          <NetworkStats />
        </ErrorBoundary>
        <ErrorBoundary>
          <TPSChart />
        </ErrorBoundary>
        <ErrorBoundary>
          <BlockchainInfo />
        </ErrorBoundary>
        <ErrorBoundary>
          <TrendingProjects />
        </ErrorBoundary>
        <ErrorBoundary>
          <EcosystemHealth />
        </ErrorBoundary>
      </div>
    </div>
  );
}
