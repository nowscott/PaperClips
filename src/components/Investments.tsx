import { useGameStore } from '../store/gameStore';
import { LineChart, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

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
      <div className="flex items-center justify-between border-b border-evolve-border pb-2">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-evolve-accent" />
          <h2 className="text-lg font-bold tracking-wide uppercase text-evolve-accent">投资 <span className="text-sm opacity-50 font-normal">Investments</span></h2>
        </div>
        <div className="text-xs text-evolve-textDim font-mono">
          Engine Level: {investmentLevel}
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-2">
        {/* 投资资金池概览 */}
        <div className="panel-inner flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-evolve-textDim uppercase tracking-wider">资金池 (Bankroll)</span>
          <span className={`text-2xl font-mono font-bold ${investmentBankroll > 0 ? 'text-evolve-success' : 'text-evolve-textMain'}`}>
            ${investmentBankroll.toFixed(2)}
          </span>
        </div>

        {/* 资金操作 */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="btn-evolve flex flex-col items-center gap-1 py-3 hover:bg-evolve-border/50"
            onClick={depositFunds}
          >
            <ArrowDownToLine className="w-4 h-4 text-evolve-success" />
            <span className="text-xs uppercase tracking-wider">全部存入 (Deposit)</span>
          </button>
          
          <button 
            className="btn-evolve flex flex-col items-center gap-1 py-3 hover:bg-evolve-border/50"
            onClick={withdrawFunds}
            disabled={investmentBankroll <= 0}
          >
            <ArrowUpFromLine className="w-4 h-4 text-evolve-textMain" />
            <span className="text-xs uppercase tracking-wider">全部提取 (Withdraw)</span>
          </button>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 风险等级控制 */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-evolve-textDim uppercase tracking-wider">策略等级 (Strategy Level)</span>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-1 text-xs border uppercase tracking-wide transition-colors ${
                riskLevel === 'low' 
                  ? 'border-evolve-accent text-evolve-accent bg-evolve-accent/10' 
                  : 'border-evolve-border text-evolve-textDim hover:border-evolve-accent/50'
              }`}
              onClick={() => setRiskLevel('low')}
            >
              Low Risk
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
                Med Risk
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
                High Risk
              </button>
            )}
          </div>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 引擎升级 */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-evolve-textDim uppercase tracking-wider mb-1">升级引擎 (Upgrade Engine)</span>
            <span className="text-xs font-mono opacity-70">成本: {upgradeCost} Yomi</span>
          </div>
          <button 
            className="btn-evolve flex items-center gap-2"
            onClick={upgradeInvestmentEngine}
            disabled={!canUpgrade}
          >
            <TrendingUp className="w-4 h-4" />
            <span>升级 (Upgrade)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
