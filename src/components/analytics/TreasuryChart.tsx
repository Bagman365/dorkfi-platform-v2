import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatChartDate } from '@/utils/analyticsUtils';

const TreasuryChart = () => {
  const { treasuryData, loading } = useAnalyticsData();

  if (loading || !treasuryData) {
    return (
      <ChartCard title="Insurance & Treasury">
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

  const SparklineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatChartDate(label)}</p>
          <p className="text-sm text-ocean-teal">
            Fund Value: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Insurance & Treasury" 
      subtitle="Holdings composition & growth"
      tooltip="Protocol treasury holdings and insurance fund composition. Shows asset diversification and fund growth over time."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Doughnut Chart */}
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Holdings Composition</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={treasuryData.holdings}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {treasuryData.holdings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {treasuryData.holdings.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sparkline */}
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Fund Growth (90 days)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={treasuryData.growthData}>
              <XAxis 
                dataKey="date" 
                hide 
              />
              <YAxis hide />
              <Tooltip content={<SparklineTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--ocean-teal))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <p className="text-lg font-bold text-ocean-teal">
              {formatCurrency(treasuryData.growthData[treasuryData.growthData.length - 1]?.value || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Current Fund Value</p>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

export default TreasuryChart;