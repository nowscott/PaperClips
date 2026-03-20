import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Play, ChevronRight, ChevronDown } from 'lucide-react';
import type { StrategyType } from '../store/slices/strategySlice';
import { formatNumber } from '../utils/formatNumber';

const STRATEGY_NAMES: Record<StrategyType, string> = {
  'RANDOM': '随机 (Random)',
  'A100': '始终选A (A100)',
  'B100': '始终选B (B100)',
  'GREEDY': '贪婪 (Greedy)',
  'GENEROUS': '慷慨 (Generous)',
  'MINIMAX': '极小化极大 (Minimax)',
  'TIT_FOR_TAT': '以牙还牙 (Tit for Tat)',
  'BEAT_LAST': '击败上轮 (Beat Last)'
};

export const StrategicModeling = () => {
  const {
    strategyEngineUnlocked,
    yomi,
    ops,
    tourneyInProg,
    tourneyCost,
    currentStrategy,
    unlockedStrategies,
    tourneyProgress,
    matchResults,
    setStrategy,
    runTourney
  } = useGameStore();

  // 添加一个状态来控制矩阵的折叠/展开，默认隐藏以节省空间
  const [showMatrix, setShowMatrix] = useState(false);

  if (!strategyEngineUnlocked) return null;

  const canAffordTourney = ops >= tourneyCost;

  return (
    <div className="panel flex flex-col gap-4">
      {/* Yomi 资源显示 */}
      <div className="flex justify-between items-center bg-evolve-accent/10 p-2 rounded border border-evolve-accent/30">
        <span className="text-sm font-bold text-evolve-accent tracking-wider">预判值 (Yomi)</span>
        <span className="text-lg font-mono text-evolve-accent">{formatNumber(yomi)}</span>
      </div>

      {/* 策略选择与控制 */}
      <div className="panel-inner flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-evolve-textDim tracking-wider">选择策略</span>
          <select 
            className="bg-evolve-bg border border-evolve-border text-evolve-textMain p-1 rounded text-sm focus:outline-none focus:border-evolve-accent"
            value={currentStrategy}
            onChange={(e) => setStrategy(e.target.value as StrategyType)}
            disabled={tourneyInProg}
          >
            {unlockedStrategies.map(strat => (
              <option key={strat} value={strat}>{STRATEGY_NAMES[strat] || strat.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <button 
          className={`btn flex items-center justify-center gap-2 py-2 mt-2 ${
            canAffordTourney && !tourneyInProg ? 'btn-primary' : 'opacity-50 cursor-not-allowed border-evolve-border'
          }`}
          onClick={runTourney}
          disabled={!canAffordTourney || tourneyInProg}
        >
          <Play className="w-4 h-4" />
          <span>运行锦标赛</span>
        </button>
        
        <div className="text-right text-xs font-mono text-evolve-textDim">
          算力成本: {formatNumber(tourneyCost)}
        </div>
      </div>

      {/* 进度条 */}
      {tourneyInProg && (
        <div className="flex flex-col gap-1 mt-2 p-2 bg-evolve-accent/5 rounded border border-evolve-accent/20">
          <div className="flex justify-between text-xs font-bold text-evolve-accent tracking-widest">
            <span className="animate-pulse">正在进行锦标赛计算...</span>
            <span className="font-mono">{tourneyProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-evolve-border rounded overflow-hidden mt-1 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-evolve-accent to-[#4a00cc] transition-all duration-200" 
              style={{ width: `${tourneyProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 比赛结果矩阵 (仅在比赛结束后有数据时显示) */}
      {!tourneyInProg && matchResults.length > 0 && (
        <div className="mt-2 flex flex-col animate-fade-in panel-inner">
          <button 
            className="flex justify-between items-center w-full py-1 text-sm font-bold text-evolve-textMain tracking-wider hover:text-evolve-accent transition-colors"
            onClick={() => setShowMatrix(!showMatrix)}
          >
            <div className="flex items-center gap-2">
              {showMatrix ? <ChevronDown className="w-4 h-4 text-evolve-accent" /> : <ChevronRight className="w-4 h-4 text-evolve-accent" />}
              <span>博弈结果矩阵</span>
            </div>
            <span className="text-xs font-mono text-evolve-textDim opacity-50">
              {showMatrix ? '收起' : '展开查看'}
            </span>
          </button>
          
          {showMatrix && (
            <div className="mt-3 flex flex-col gap-2 animate-fade-in border-t border-evolve-border/50 pt-3">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-xs font-mono text-center border-collapse">
                  <thead>
                    <tr className="text-evolve-textDim">
                      <th className="p-1.5 border border-evolve-border/30 bg-evolve-border/10"></th>
                      {unlockedStrategies.map((_, i) => (
                        <th key={i} className="p-1.5 border border-evolve-border/30 bg-evolve-border/10 font-bold">
                          S{i+1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matchResults.map((row, i) => {
                      const isCurrent = unlockedStrategies[i] === currentStrategy;
                      return (
                        <tr key={i} className={`transition-colors ${isCurrent ? "bg-evolve-accent/15" : "hover:bg-evolve-border/10"}`}>
                          <td className={`p-1.5 border border-evolve-border/30 font-bold ${isCurrent ? "text-evolve-accent shadow-[inset_2px_0_0_rgba(0,168,255,1)]" : "text-evolve-textDim bg-evolve-border/5"}`}>
                            S{i+1}
                          </td>
                          {row.map((score, j) => {
                            const isSelf = i === j;
                            // 根据得分给不同颜色：高分偏绿，低分偏红/灰
                            const scoreColor = score > 5 ? 'text-evolve-success' : score < 3 ? 'text-evolve-textDim opacity-50' : 'text-evolve-textMain';
                            return (
                              <td key={j} className={`p-1.5 border border-evolve-border/30 ${isSelf ? 'bg-evolve-border/20 text-evolve-textDim/20' : scoreColor}`}>
                                {isSelf ? '·' : score}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center text-[10px] text-evolve-textDim opacity-70 mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 inline-block bg-evolve-accent/30 border border-evolve-accent/50 rounded-sm"></span>
                  当前选择策略 (S{unlockedStrategies.indexOf(currentStrategy) + 1})
                </span>
                <span>行: 策略 A / 列: 策略 B</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};