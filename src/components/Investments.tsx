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
    <div className="panel flex flex-col gap-3 border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.05)]">
      {/* 顶部标题栏 & 升级按钮合并 */}
      <div className="flex justify-between items-end border-b border-evolve-border pb-2">
        <div className="flex flex-col">
          <span className="text-xs text-evolve-textDim tracking-wider font-bold">引擎等级: {investmentLevel}</span>
          <span className="text-[10px] font-mono opacity-70">升级成本: {formatNumber(upgradeCost)} Yomi</span>
        </div>
        <button 
          className="btn-evolve flex items-center gap-1 py-1 px-2 text-[10px]"
          onClick={upgradeInvestmentEngine}
          disabled={!canUpgrade}
        >
          <TrendingUp className="w-3 h-3" />
          升级
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        {/* 投资资金池与操作合并行 */}
        <div className="flex justify-between items-center bg-evolve-bg/50 p-2 rounded border border-evolve-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-evolve-textDim tracking-wider">投资资金池</span>
            <span className={`text-lg font-mono font-bold leading-none mt-1 ${investmentBankroll > 0 ? 'text-evolve-success' : 'text-evolve-textMain'}`}>
              ${formatNumber(investmentBankroll, 2)}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              className="btn-evolve flex flex-col items-center gap-0.5 py-1 px-3 bg-evolve-border/20"
              onClick={depositFunds}
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-evolve-success" />
              <span className="text-[10px] tracking-wider">存入</span>
            </button>
            <button 
              className="btn-evolve flex flex-col items-center gap-0.5 py-1 px-3 bg-evolve-border/20"
              onClick={withdrawFunds}
              disabled={investmentBankroll <= 0}
            >
              <ArrowUpFromLine className="w-3.5 h-3.5 text-evolve-textMain" />
              <span className="text-[10px] tracking-wider">提取</span>
            </button>
          </div>
        </div>

        {/* 风险等级控制 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-evolve-textDim tracking-wider">风险策略</span>
          <div className="flex gap-1.5">
            <button
              className={`flex-1 py-1 text-[10px] border uppercase tracking-wide transition-colors rounded ${
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
                className={`flex-1 py-1 text-[10px] border uppercase tracking-wide transition-colors rounded animate-fade-in ${
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
                className={`flex-1 py-1 text-[10px] border uppercase tracking-wide transition-colors rounded animate-fade-in ${
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
      </div>
    </div>
  );
};