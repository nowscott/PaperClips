import { useGameStore } from '../store/gameStore';
import { useContinuousClick } from '../hooks/useContinuousClick';
import { Factory, Zap, Target, Combine } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

export const SpaceAndDrones = () => {
  const {
    nanoWireUnlocked,
    harvesterDronesUnlocked,
    wireDronesUnlocked,
    factoriesUnlocked,
    
    availableMatter,
    acquiredMatter,
    
    harvesterDrones,
    harvesterDroneCost,
    
    wireDrones,
    wireDroneCost,
    
    factories,
    factoryCost,
    
    swarmUnlocked,
    sliderPos,
    setSliderPos,
    
    unsoldInventory,
    buyHarvesterDrone,
    buyWireDrone,
    buyFactory,

    harvestRate,
    wireProcessRate,
    hypnoDronesReleased
  } = useGameStore();

  const buyHarvesterContinuous = useContinuousClick(buyHarvesterDrone, 50, 200);
  const buyWireContinuous = useContinuousClick(buyWireDrone, 50, 200);
  const buyFactoryContinuous = useContinuousClick(buyFactory, 50, 200);

  if (!nanoWireUnlocked) return null;

  const EARTH_MATTER = 6000000000000000000000; // 原版地球总物质 (6 Octillion)

  // 为了视觉体验：因为早期已采集物质相对地球总量太小，几乎看不见
  // 我们使用对数比例或强制最小显示宽度来保证视觉反馈
  // 如果有已采集物质，至少给它 1% 的宽度，让玩家能看到动静
  const rawAcquiredPercent = (acquiredMatter / EARTH_MATTER) * 100;
  const visualAcquiredPercent = acquiredMatter > 0 ? Math.max(1, rawAcquiredPercent) : 0;
  
  // 剩余可用物质占据剩余的宽度
  const visualAvailablePercent = 100 - visualAcquiredPercent;
  
  // 格式化真实百分比，保留两位小数
  const realAcquiredPercentStr = rawAcquiredPercent < 0.01 && rawAcquiredPercent > 0 ? "<0.01" : rawAcquiredPercent.toFixed(2);
  const realAvailablePercentStr = (100 - rawAcquiredPercent) < 0.01 && (100 - rawAcquiredPercent) > 0 ? "<0.01" : (100 - rawAcquiredPercent).toFixed(2);

  return (
    <div className="panel flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs">
          {/* 左侧：已采集 */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-evolve-accent tracking-wider font-bold">已采集</span>
            <span className="font-mono leading-none">{formatNumber(acquiredMatter)}</span>
            <span className="text-[9px] font-mono text-evolve-accent opacity-60">({realAcquiredPercentStr}%)</span>
          </div>
          {/* 右侧：可用物质 */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] font-mono text-evolve-textDim opacity-60">({realAvailablePercentStr}%)</span>
            <span className="font-mono leading-none">{formatNumber(availableMatter)}</span>
            <span className="text-[10px] text-evolve-textDim tracking-wider font-bold">可用</span>
          </div>
        </div>
        
        {/* 复合进度条 */}
        <div className="w-full h-1.5 bg-evolve-border rounded-full overflow-hidden flex mt-0.5">
          {/* 已采集的物质 (左侧) */}
          <div 
            className="h-full bg-evolve-accent transition-all duration-300" 
            style={{ width: `${visualAcquiredPercent}%` }}
          />
          {/* 剩余可用物质 (右侧) */}
          <div 
            className="h-full bg-evolve-textDim opacity-40 transition-all duration-300" 
            style={{ width: `${visualAvailablePercent}%` }}
          />
        </div>

        {harvestRate > 0 && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-evolve-textDim tracking-wider opacity-70">采集速率</span>
            <span className="font-mono text-xs text-evolve-accent">{formatNumber(Math.floor(harvestRate))} g/秒</span>
          </div>
        )}
        {wireProcessRate > 0 && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-evolve-textDim tracking-wider opacity-70">拉丝速率</span>
            <span className="font-mono text-xs text-evolve-accent">{formatNumber(Math.floor(wireProcessRate))} 英寸/秒</span>
          </div>
        )}
        
        {/* 第二阶段后显示可用回形针 (原积压库存) 以供组装消耗 */}
        {hypnoDronesReleased && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-evolve-textDim tracking-wider opacity-70">可用回形针</span>
            <span className="font-mono text-xs text-evolve-accent">{formatNumber(unsoldInventory)} 件</span>
          </div>
        )}
      </div>

      <div className="h-px bg-evolve-border w-full"></div>

      {/* 无人机控制 */}
      <div className="flex flex-col gap-1.5">
        {harvesterDronesUnlocked && (
          <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-evolve-textMain" />
                <span className="text-xs font-bold leading-none">采集无人机</span>
              </div>
              <span className="text-[10px] font-mono opacity-70 mt-1">造价: {formatNumber(harvesterDroneCost)} 件</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm text-evolve-accent leading-none">{formatNumber(harvesterDrones)}</span>
              <button 
                className="btn-evolve text-[10px] py-0.5 px-2 select-none touch-none"
                {...buyHarvesterContinuous}
                disabled={unsoldInventory < harvesterDroneCost}
              >
                组装
              </button>
            </div>
          </div>
        )}

        {wireDronesUnlocked && (
          <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Combine className="w-3.5 h-3.5 text-evolve-textMain" />
                <span className="text-xs font-bold leading-none">拉丝无人机</span>
              </div>
              <span className="text-[10px] font-mono opacity-70 mt-1">造价: {formatNumber(wireDroneCost)} 件</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm text-evolve-accent leading-none">{formatNumber(wireDrones)}</span>
              <button 
                className="btn-evolve text-[10px] py-0.5 px-2 select-none touch-none"
                {...buyWireContinuous}
                disabled={unsoldInventory < wireDroneCost}
              >
                组装
              </button>
            </div>
          </div>
        )}

        {factoriesUnlocked && (
          <div className="flex justify-between items-center bg-evolve-warning/5 p-1.5 rounded border border-evolve-warning/20">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-evolve-warning" />
                <span className="text-xs font-bold text-evolve-warning leading-none">回形针工厂</span>
              </div>
              <span className="text-[10px] font-mono opacity-70 mt-1">造价: {formatNumber(factoryCost)} 件</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm text-evolve-warning leading-none">{formatNumber(factories)}</span>
              <button 
                className="btn-evolve btn-evolve-warning text-[10px] py-0.5 px-2 select-none touch-none"
                {...buyFactoryContinuous}
                disabled={unsoldInventory < factoryCost}
              >
                组装
              </button>
            </div>
          </div>
        )}

        {/* 蜂群计算 (Swarm Computing) 滑块 */}
        {swarmUnlocked && (
          <>
            <div className="h-px bg-evolve-border w-full my-2"></div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold text-evolve-accent">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>蜂群计算分配</span>
                  <span className="text-[9px] text-evolve-textDim opacity-70 font-normal ml-1">
                    偏向"思考"产出算力，偏向"工作"提升产能
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 px-1">
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={sliderPos} 
                  onChange={(e) => setSliderPos(parseInt(e.target.value))}
                  className="w-full h-2 bg-evolve-border rounded-lg appearance-none cursor-pointer accent-evolve-accent"
                />
                <div className="flex justify-between text-[10px] font-mono text-evolve-textDim">
                  <span>思考: {Math.max(0, 200 - sliderPos)}%</span>
                  <span>工作: {Math.max(0, sliderPos)}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};