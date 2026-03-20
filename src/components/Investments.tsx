import { useGameStore } from '../store/gameStore';
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

export const Investments = () => {
  const { 
    investmentEngineUnlocked,
    investmentLevel,
    investmentBankroll,
    riskLevel,
    yomi,
    depositFunds,
    withdrawFunds,
    upgradeInvestmentEngine,
    setRiskLevel
  } = useGameStore();

  if (!investmentEngineUnlocked) return null;

  const upgradeCost = Math.floor(Math.pow(investmentLevel + 1, Math.E) * 100);
  const canUpgrade = yomi >= upgradeCost;

  return (
    <div className="panel flex flex-col gap-4 border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.05)]">
      <div className="text-right text-xs text-evolve-textDim font-mono border-b border-evolve-border pb-2">
        引擎等级: {investmentLevel}
      </div>

      <div className="flex flex-col gap-5 mt-2">
        {/* 投资资金池概览 */}
        <div className="panel-inner flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-evolve-textDim tracking-wider">投资资金池</span>
          <span className={`text-2xl font-mono font-bold ${investmentBankroll > 0 ? 'text-evolve-success' : 'text-evolve-textMain'}`}>
            ${formatNumber(investmentBankroll, 2)}
          </span>
        </div>

        {/* 资金操作 */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="btn-evolve flex flex-col items-center gap-1 py-3 hover:bg-evolve-border/50"
            onClick={depositFunds}
          >
            <ArrowDownToLine className="w-4 h-4 text-evolve-success" />
            <span className="text-xs tracking-wider">全部存入</span>
          </button>
          
          <button 
            className="btn-evolve flex flex-col items-center gap-1 py-3 hover:bg-evolve-border/50"
            onClick={withdrawFunds}
            disabled={investmentBankroll <= 0}
          >
            <ArrowUpFromLine className="w-4 h-4 text-evolve-textMain" />
            <span className="text-xs tracking-wider">全部提取</span>
          </button>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 风险等级控制 */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-evolve-textDim tracking-wider">风险策略</span>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-1 text-xs border uppercase tracking-wide transition-colors ${
                riskLevel === 'low' 
                  ? 'border-evolve-accent text-evolve-accent bg-evolve-accent/10' 
                  : 'border-evolve-border text-evolve-textDim hover:border-evolve-accent/50'
              }`}
              onClick={() => setRiskLevel('low')}
            >
              低风险
            </button>
            {investmentLevel >= 2 && (
              <button
                className={`flex-1 py-1 text-xs border uppercase tracking-wide transition-colors animate-fade-in ${
                  riskLevel === 'med' 
                    ? 'border-evolve-warning text-evolve-warning bg-evolve-warning/10' 
                    : 'border-evolve-border text-evolve-textDim hover:border-evolve-warning/50'
                }`}
                onClick={() => setRiskLevel('med')}
              >
                中等风险
              </button>
            )}
            {investmentLevel >= 3 && (
              <button
                className={`flex-1 py-1 text-xs border uppercase tracking-wide transition-colors animate-fade-in ${
                  riskLevel === 'high' 
                    ? 'border-evolve-danger text-evolve-danger bg-evolve-danger/10' 
                    : 'border-evolve-border text-evolve-textDim hover:border-evolve-danger/50'
                }`}
                onClick={() => setRiskLevel('high')}
              >
                高风险
              </button>
            )}
          </div>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 引擎升级 */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-evolve-textDim tracking-wider mb-1">升级投资引擎</span>
            <span className="text-xs font-mono opacity-70">升级成本: {formatNumber(upgradeCost)} 预判值 (Yomi)</span>
          </div>
          <button 
            className="btn-evolve flex items-center gap-2"
            onClick={upgradeInvestmentEngine}
            disabled={!canUpgrade}
          >
            <TrendingUp className="w-4 h-4" />
            <span>升级</span>
          </button>
        </div>
      </div>
    </div>
  );
};