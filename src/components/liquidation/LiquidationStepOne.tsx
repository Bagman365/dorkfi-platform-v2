
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import DorkFiButton from '@/components/ui/DorkFiButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign, Info } from 'lucide-react';
import { LiquidationAccount } from '@/hooks/useLiquidationData';
import { LiquidationParams } from './EnhancedAccountDetailModal';

interface LiquidationStepOneProps {
  account: LiquidationAccount;
  onComplete: (params: LiquidationParams) => void;
  onCancel: () => void;
}

// Mock prices for demonstration
const MOCK_PRICES: Record<string, number> = {
  'ETH': 2000,
  'BTC': 45000,
  'USDC': 1,
  'VOI': 0.5,
  'ALGO': 0.25,
  'UNIT': 0.1,
};

export default function LiquidationStepOne({ account, onComplete, onCancel }: LiquidationStepOneProps) {
  const [selectedCollateral, setSelectedCollateral] = useState<string>('');
  const [repayAmountUSD, setRepayAmountUSD] = useState<string>('');
  const [calculations, setCalculations] = useState<{
    collateralNeeded: number;
    liquidationBonus: number;
    newLTV: number;
    collateralPrice: number;
  } | null>(null);

  const liquidationBonusRate = 0.05; // 5% bonus

  useEffect(() => {
    if (selectedCollateral && repayAmountUSD && parseFloat(repayAmountUSD) > 0) {
      const repayAmount = parseFloat(repayAmountUSD);
      const collateralPrice = MOCK_PRICES[selectedCollateral] || 1;
      const liquidationBonus = repayAmount * liquidationBonusRate;
      const totalCollateralValue = repayAmount + liquidationBonus;
      const collateralNeeded = totalCollateralValue / collateralPrice;
      
      // Calculate new LTV after liquidation
      const newTotalBorrowed = account.totalBorrowed - repayAmount;
      const newLTV = newTotalBorrowed > 0 ? newTotalBorrowed / account.totalSupplied : 0;

      setCalculations({
        collateralNeeded,
        liquidationBonus,
        newLTV,
        collateralPrice,
      });
    } else {
      setCalculations(null);
    }
  }, [selectedCollateral, repayAmountUSD, account.totalBorrowed, account.totalSupplied]);

  const handleContinue = () => {
    if (!selectedCollateral || !repayAmountUSD || !calculations) return;

    const params: LiquidationParams = {
      repayAmountUSD: parseFloat(repayAmountUSD),
      repayToken: account.borrowedAssets[0]?.symbol || 'USDC', // Assuming first borrowed asset
      collateralToken: selectedCollateral,
      collateralAmount: calculations.collateralNeeded,
      liquidationBonus: calculations.liquidationBonus,
    };

    onComplete(params);
  };

  const maxRepayAmount = Math.min(
    account.totalBorrowed * 0.5, // Max 50% of debt
    selectedCollateral ? (account.collateralAssets.find(a => a.symbol === selectedCollateral)?.valueUSD || 0) : 0
  );

  return (
    <div className="space-y-5">
      {/* Collateral Selection */}
      <div className="space-y-3">
        <Label htmlFor="collateral-select" className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Collateral Asset
        </Label>
        <Select value={selectedCollateral} onValueChange={setSelectedCollateral}>
          <SelectTrigger className="bg-white/80 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-white h-12">
            <SelectValue placeholder="Choose collateral asset" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 z-50">
            {account.collateralAssets.map((asset) => (
              <SelectItem key={asset.symbol} value={asset.symbol}>
                {asset.symbol} - {asset.amount.toLocaleString()} (${asset.valueUSD.toLocaleString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Choose which collateral will be seized to cover the debt
        </p>
      </div>

      {/* Repayment Amount */}
      <div className="space-y-3">
        <Label htmlFor="repay-amount" className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Repayment Amount (USD)
        </Label>
        <Input
          id="repay-amount"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={repayAmountUSD}
          onChange={(e) => setRepayAmountUSD(e.target.value)}
          className="bg-white/80 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-white h-12 text-lg"
          max={maxRepayAmount}
        />
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Max repayable: ${maxRepayAmount.toLocaleString()} (50% of debt or collateral value)
        </p>
      </div>

      {/* Calculations */}
      {calculations && (
        <Card className="bg-white/80 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Collateral Price</span>
              <span className="text-sm font-medium text-slate-800 dark:text-white">
                ${calculations.collateralPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Liquidation Bonus (5%)</span>
              <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                ${calculations.liquidationBonus.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Collateral to Receive</span>
              <span className="text-sm font-medium text-slate-800 dark:text-white">
                {calculations.collateralNeeded.toFixed(4)} {selectedCollateral}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">New LTV</span>
              <span className="text-sm font-medium text-slate-800 dark:text-white">
                {(calculations.newLTV * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <DorkFiButton
          variant="secondary"
          onClick={onCancel}
          className="h-12 flex-1 font-semibold"
        >
          Cancel
        </DorkFiButton>
        <DorkFiButton
          onClick={handleContinue}
          disabled={!selectedCollateral || !repayAmountUSD || !calculations}
          className="h-12 flex-1 font-semibold"
        >
          Continue
        </DorkFiButton>
      </div>
    </div>
  );
}
