import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  controls?: React.ReactNode;
  tooltip?: string;
}

const ChartCard = ({ title, subtitle, children, className = '', controls, tooltip }: ChartCardProps) => {
  const CardContent = (
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

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {CardContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return CardContent;
};

export default ChartCard;