import { useGameStore } from '../store/gameStore';
import { useContinuousClick } from '../hooks/useContinuousClick';
import { Sun, Battery, Zap, AlertTriangle } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

export const PowerGrid = () => {
  const {
    solarFarms,
    solarFarmCost,
    batteries,
    batteryCost,
    maxStorage,
    currentStorage,
    totalPowerGenerated,
    totalPowerConsumed,
    powerProductionRatio,
    unsoldInventory,
    buySolarFarm,
    buyBattery,
    solarFarmsUnlocked
  } = useGameStore();

  const buySolarFarmContinuous = useContinuousClick(() => buySolarFarm(1), 50, 200);
  const buyBatteryContinuous = useContinuousClick(() => buyBattery(1), 50, 200);

  if (!solarFarmsUnlocked) return null;

  const storagePercent = (currentStorage / maxStorage) * 100;
  const isPowerDeficit = totalPowerConsumed > totalPowerGenerated && currentStorage <= 0;

  return (
    <div className="panel flex flex-col gap-3">
      {/* 状态概览 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="panel-inner p-2 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-evolve-textDim">
            <Sun className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">总发电量</span>
          </div>
          <span className="font-mono text-sm text-evolve-success">{formatNumber(totalPowerGenerated)} <span className="text-[10px]">MW</span></span>
        </div>
        <div className="panel-inner p-2 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-evolve-textDim">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">总耗电量</span>
          </div>
          <span className="font-mono text-sm text-evolve-danger">{formatNumber(totalPowerConsumed)} <span className="text-[10px]">MW</span></span>
        </div>
      </div>

      {/* 蓄电池状态 */}
      <div className="panel-inner p-2 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-1.5 text-evolve-textDim">
            <Battery className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">蓄电池存储</span>
          </div>
          <span className="font-mono text-xs text-evolve-textMain">
            {formatNumber(Math.floor(currentStorage))} / {formatNumber(maxStorage)} <span className="text-[10px] opacity-60">MWs</span>
          </span>
        </div>
        <div className="h-2 bg-evolve-border rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${storagePercent < 20 ? 'bg-evolve-danger' : 'bg-evolve-accent'}`}
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </div>

      {/* 电力短缺警告 */}
      {isPowerDeficit && (
        <div className="bg-evolve-danger/10 border border-evolve-danger/30 rounded p-2 flex items-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-evolve-danger shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-evolve-danger uppercase">电力短缺</span>
            <span className="text-[9px] text-evolve-textDim">生产效率降至: {(powerProductionRatio * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      <div className="h-px bg-evolve-border w-full my-1"></div>

      {/* 建造选项 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">太阳能电站</span>
            <span className="text-[10px] font-mono opacity-70 mt-1">造价: {formatNumber(solarFarmCost)} 件</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-sm text-evolve-accent leading-none">{formatNumber(solarFarms)}</span>
            <div className="flex gap-1">
              <button 
                className="btn-evolve text-[10px] py-0.5 px-2 select-none touch-none"
                {...buySolarFarmContinuous}
                disabled={unsoldInventory < solarFarmCost}
              >
                建造
              </button>
              <button 
                className="btn-evolve text-[10px] py-0.5 px-1.5 opacity-60 hover:opacity-100"
                onClick={() => buySolarFarm(10)}
                disabled={unsoldInventory < solarFarmCost}
              >
                +10
              </button>
              <button 
                className="btn-evolve text-[10px] py-0.5 px-1.5 opacity-60 hover:opacity-100"
                onClick={() => buySolarFarm(100)}
                disabled={unsoldInventory < solarFarmCost}
              >
                +100
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">蓄电池组</span>
            <span className="text-[10px] font-mono opacity-70 mt-1">造价: {formatNumber(batteryCost)} 件</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-sm text-evolve-accent leading-none">{formatNumber(batteries)}</span>
            <div className="flex gap-1">
              <button 
                className="btn-evolve text-[10px] py-0.5 px-2 select-none touch-none"
                {...buyBatteryContinuous}
                disabled={unsoldInventory < batteryCost}
              >
                建造
              </button>
              <button 
                className="btn-evolve text-[10px] py-0.5 px-1.5 opacity-60 hover:opacity-100"
                onClick={() => buyBattery(10)}
                disabled={unsoldInventory < batteryCost}
              >
                +10
              </button>
              <button 
                className="btn-evolve text-[10px] py-0.5 px-1.5 opacity-60 hover:opacity-100"
                onClick={() => buyBattery(100)}
                disabled={unsoldInventory < batteryCost}
              >
                +100
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
