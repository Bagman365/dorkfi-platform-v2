import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  controls?: React.ReactNode;
}

const ChartCard = ({ title, subtitle, children, className = '', controls }: ChartCardProps) => {
  return (
    <div className={`dorkfi-card-bg rounded-xl border border-border/40 p-6 card-hover ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="dorkfi-h3">{title}</h3>
          {subtitle && <p className="dorkfi-caption mt-1">{subtitle}</p>}
        </div>
        {controls && (
          <div className="flex items-center gap-2">
            {controls}
          </div>
        )}
      </div>
      
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;