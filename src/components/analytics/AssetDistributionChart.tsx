import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency } from '@/utils/analyticsUtils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const AssetDistributionChart = () => {
  const { assetDistribution, loading } = useAnalyticsData();
  const breakpoint = useBreakpoint();
  
  const chartHeight = breakpoint === 'mobile' ? 150 : 200;
  const pieRadius = breakpoint === 'mobile' ? 60 : 80;

  if (loading || !assetDistribution) {
    return (
      <ChartCard title="Asset Distribution">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            Value: {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Asset Distribution" 
      subtitle="Deposits vs Borrows by asset"
      tooltip="Distribution of deposits and borrows across different assets. Shows which assets are most popular for lending and borrowing."
      className="h-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Deposits Chart */}
        <div className="flex flex-col mb-3 sm:mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 sm:mb-4 text-center">
            Deposits
          </h4>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={assetDistribution.deposits}
                cx="50%"
                cy="50%"
                outerRadius={pieRadius}
                paddingAngle={2}
                dataKey="value"
              >
                {assetDistribution.deposits.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {assetDistribution.deposits.map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-[10px] sm:text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Borrows Chart */}
        <div className="flex flex-col mb-3 sm:mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 sm:mb-4 text-center">
            Borrows
          </h4>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={assetDistribution.borrows}
                cx="50%"
                cy="50%"
                outerRadius={pieRadius}
                paddingAngle={2}
                dataKey="value"
              >
                {assetDistribution.borrows.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {assetDistribution.borrows.map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-[10px] sm:text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

export default AssetDistributionChart;