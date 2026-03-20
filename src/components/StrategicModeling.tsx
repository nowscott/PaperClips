import { useGameStore } from '../store/gameStore';
import { BrainCircuit, Play, ChevronRight } from 'lucide-react';
import type { StrategyType } from '../store/slices/strategySlice';

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

  if (!strategyEngineUnlocked) return null;

  const canAffordTourney = ops >= tourneyCost;

  return (
    <div className="panel flex flex-col gap-4">
      {/* 标题 */}
      <div className="flex justify-between items-center border-b border-evolve-border pb-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-evolve-accent" />
          <h2 className="text-lg font-bold tracking-widest uppercase">战略建模 (Strategic Modeling)</h2>
        </div>
      </div>

      {/* Yomi 资源显示 */}
      <div className="flex justify-between items-center bg-evolve-accent/10 p-2 rounded border border-evolve-accent/30">
        <span className="text-sm font-bold text-evolve-accent uppercase tracking-wider">Yomi</span>
        <span className="text-lg font-mono text-evolve-accent">{yomi.toLocaleString()}</span>
      </div>

      {/* 策略选择与控制 */}
      <div className="panel-inner flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-evolve-textDim uppercase tracking-wider">选择策略 (Pick Strategy)</span>
          <select 
            className="bg-evolve-bg border border-evolve-border text-evolve-textMain p-1 rounded text-sm focus:outline-none focus:border-evolve-accent"
            value={currentStrategy}
            onChange={(e) => setStrategy(e.target.value as StrategyType)}
            disabled={tourneyInProg}
          >
            {unlockedStrategies.map(strat => (
              <option key={strat} value={strat}>{strat.replace(/_/g, ' ')}</option>
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
          <span>运行锦标赛 (Run Tournament)</span>
        </button>
        
        <div className="text-right text-xs font-mono text-evolve-textDim">
          成本: {tourneyCost.toLocaleString()} Ops
        </div>
      </div>

      {/* 进度条 */}
      {tourneyInProg && (
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex justify-between text-xs text-evolve-textDim">
            <span>正在进行锦标赛...</span>
            <span>{tourneyProgress}%</span>
          </div>
          <div className="w-full h-1 bg-evolve-border rounded overflow-hidden">
            <div 
              className="h-full bg-evolve-accent transition-all duration-200" 
              style={{ width: `${tourneyProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 比赛结果矩阵 (仅在比赛结束后有数据时显示) */}
      {!tourneyInProg && matchResults.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 animate-fade-in">
          <div className="flex items-center gap-1 text-xs text-evolve-textDim uppercase tracking-wider border-b border-evolve-border pb-1">
            <ChevronRight className="w-3 h-3" />
            <span>最新锦标赛结果矩阵 (Latest Results)</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-center border-collapse">
              <thead>
                <tr className="text-evolve-textDim opacity-70">
                  <th className="p-1 border border-evolve-border/30"></th>
                  {unlockedStrategies.map((_, i) => (
                    <th key={i} className="p-1 border border-evolve-border/30">S{i+1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matchResults.map((row, i) => (
                  <tr key={i} className={unlockedStrategies[i] === currentStrategy ? "bg-evolve-accent/10" : ""}>
                    <td className={`p-1 border border-evolve-border/30 font-bold ${unlockedStrategies[i] === currentStrategy ? "text-evolve-accent" : "text-evolve-textDim"}`}>
                      S{i+1}
                    </td>
                    {row.map((score, j) => (
                      <td key={j} className={`p-1 border border-evolve-border/30 ${i === j ? 'bg-evolve-border/20 text-evolve-textDim/30' : ''}`}>
                        {i === j ? '-' : score}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-evolve-textDim text-center opacity-70">
            * 高亮行(S{unlockedStrategies.indexOf(currentStrategy) + 1})为你选择的策略
          </div>
        </div>
      )}
    </div>
  );
};