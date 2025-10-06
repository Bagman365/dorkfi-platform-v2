
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DorkFiButton from '@/components/ui/DorkFiButton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { LiquidationAccount } from '@/hooks/useLiquidationData';
import { LiquidationParams } from './EnhancedAccountDetailModal';
import { shortenAddress } from '@/utils/liquidationUtils';

interface LiquidationStepTwoProps {
  account: LiquidationAccount;
  liquidationParams: LiquidationParams;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function LiquidationStepTwo({ 
  account, 
  liquidationParams, 
  onConfirm, 
  onCancel 
}: LiquidationStepTwoProps) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleConfirm = async () => {
    setIsExecuting(true);
    try {
      await onConfirm();
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Transaction Summary */}
      <Card className="bg-white/80 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Target Position</span>
            <span className="text-sm font-medium font-mono text-slate-800 dark:text-white">
              {shortenAddress(account.walletAddress)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Debt Repayment</span>
            <span className="text-sm font-medium text-slate-800 dark:text-white">
              ${liquidationParams.repayAmountUSD.toLocaleString()} {liquidationParams.repayToken}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Collateral to Receive</span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
              {liquidationParams.collateralAmount.toFixed(4)} {liquidationParams.collateralToken}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Liquidation Bonus (5%)</span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
              ${liquidationParams.liquidationBonus.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Message */}
      <div className="text-center space-y-3 p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          You are repaying <span className="font-bold text-slate-900 dark:text-white">
            ${liquidationParams.repayAmountUSD.toLocaleString()}
          </span> of this borrower's debt
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          In return, you'll receive <span className="font-bold text-teal-600 dark:text-teal-400">
            {liquidationParams.collateralAmount.toFixed(4)} {liquidationParams.collateralToken}
          </span> (5% bonus included)
        </p>
        
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>This action cannot be undone</span>
        </div>
      </div>

      {/* Health Factor Impact */}
      <Card className="bg-white/80 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Current Health</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {account.healthFactor.toFixed(3)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">After Liquidation</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">
                {((account.totalBorrowed - liquidationParams.repayAmountUSD) / 
                  account.totalSupplied * 1.5).toFixed(3)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <DorkFiButton 
          variant="secondary" 
          onClick={onCancel}
          disabled={isExecuting}
          className="h-12 flex-1 font-semibold"
        >
          Cancel
        </DorkFiButton>
        <DorkFiButton 
          variant="danger"
          onClick={handleConfirm}
          disabled={isExecuting}
          className="h-12 flex-1 font-semibold"
        >
          {isExecuting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Executing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Confirm
            </div>
          )}
        </DorkFiButton>
      </div>
    </div>
  );
}
