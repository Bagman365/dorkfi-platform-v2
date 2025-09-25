import React from 'react';
import KPICard from './KPICard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatNumber } from '@/utils/analyticsUtils';

const KPIGrid = () => {
  const { kpiData, loading } = useAnalyticsData();

  if (loading || !kpiData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
      <KPICard
        title="TVL"
        value={formatCurrency(kpiData.tvl)}
        change={5.4}
        icon="📊"
      />
      <KPICard
        title="Total Borrowed"
        value={formatCurrency(kpiData.totalBorrowed)}
        change={3.2}
        icon="💰"
      />
      <KPICard
        title="WAD Circulation"
        value={formatCurrency(kpiData.wadCirculation)}
        change={2.1}
        icon="🪙"
      />
      <KPICard
        title="Protocol Revenue"
        value={formatCurrency(kpiData.protocolRevenue)}
        subtitle="MTD"
        change={8.7}
        icon="📈"
      />
      <KPICard
        title="Active Wallets"
        value={formatNumber(kpiData.activeWallets)}
        subtitle="MAU"
        change={12.3}
        icon="👥"
      />
    </div>
  );
};

export default KPIGrid;