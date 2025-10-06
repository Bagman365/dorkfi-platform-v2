
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { MarketData } from "@/hooks/useMarketData";
import MarketsDesktopTable from "./MarketsDesktopTable";
import MarketsTabletTable from "./MarketsTabletTable";
import MarketCardView from "./MarketCardView";

interface MarketsTableContentProps {
  markets: MarketData[];
  onRowClick: (market: MarketData) => void;
  onInfoClick: (e: React.MouseEvent, market: MarketData) => void;
  onDepositClick: (asset: string) => void;
  onWithdrawClick: (asset: string) => void;
  onBorrowClick: (asset: string) => void;
}

const MarketsTableContent = ({ 
  markets, 
  onRowClick, 
  onInfoClick, 
  onDepositClick,
  onWithdrawClick, 
  onBorrowClick 
}: MarketsTableContentProps) => {
  const breakpoint = useBreakpoint();

  if (breakpoint === "mobile") {
    return (
      <MarketCardView
        markets={markets}
        onRowClick={onRowClick}
        onInfoClick={onInfoClick}
        onDepositClick={onDepositClick}
        onWithdrawClick={onWithdrawClick}
        onBorrowClick={onBorrowClick}
      />
    );
  }

  if (breakpoint === "tablet") {
    return (
      <MarketsTabletTable
        markets={markets}
        onRowClick={onRowClick}
        onInfoClick={onInfoClick}
        onDepositClick={onDepositClick}
        onWithdrawClick={onWithdrawClick}
        onBorrowClick={onBorrowClick}
      />
    );
  }

  // desktop
  return (
    <MarketsDesktopTable
      markets={markets}
      onRowClick={onRowClick}
      onInfoClick={onInfoClick}
      onDepositClick={onDepositClick}
      onWithdrawClick={onWithdrawClick}
      onBorrowClick={onBorrowClick}
    />
  );
};

export default MarketsTableContent;
