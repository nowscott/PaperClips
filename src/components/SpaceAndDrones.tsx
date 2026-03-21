import { useGameStore } from '../store/gameStore';
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
    wireProcessRate
  } = useGameStore();

  if (!nanoWireUnlocked) return null;

  const EARTH_MATTER = 10 ** 24; // 简化的地球物质总量，用于计算进度条比例

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
    <div className="panel flex flex-col gap-4">
      {/* 物质资源显示 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-evolve-textDim tracking-wider">物质状态</span>
          </div>
          
          {/* 复合进度条：背景是空的，已采集是高亮色，可用物质是暗色 */}
          <div className="w-full h-2 bg-evolve-border rounded overflow-hidden flex">
            {/* 已采集的物质 (左侧，代表已经挖出来的) */}
            <div 
              className="h-full bg-evolve-accent transition-all duration-300" 
              style={{ width: `${visualAcquiredPercent}%` }}
              title={`已采集: ${formatNumber(acquiredMatter)} g`}
            />
            {/* 剩余可用物质 (右侧，代表还在地球上的) */}
            <div 
              className="h-full bg-evolve-textDim opacity-50 transition-all duration-300" 
              style={{ width: `${visualAvailablePercent}%` }}
              title={`可用物质: ${formatNumber(availableMatter)} g`}
            />
          </div>

          <div className="flex justify-between items-center mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-evolve-accent tracking-wider opacity-70">
                已采集 ({realAcquiredPercentStr}%)
              </span>
              <span className="font-mono text-xs">{formatNumber(acquiredMatter)} g</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-evolve-textDim tracking-wider opacity-70">
                可用物质 ({realAvailablePercentStr}%)
              </span>
              <span className="font-mono text-xs">{formatNumber(availableMatter)} g</span>
            </div>
          </div>
        </div>

        {harvestRate > 0 && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-evolve-textDim tracking-wider opacity-70">采集速率</span>
            <span className="font-mono text-xs text-evolve-accent">{formatNumber(Math.floor(harvestRate))} g/秒</span>
          </div>
        )}
        {wireProcessRate > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-evolve-textDim tracking-wider opacity-70">拉丝速率</span>
            <span className="font-mono text-xs text-evolve-accent">{formatNumber(Math.floor(wireProcessRate))} 英寸/秒</span>
          </div>
        )}
      </div>

      <div className="h-px bg-evolve-border w-full my-1"></div>

      {/* 无人机控制 */}
      <div className="flex flex-col gap-2">
        {harvesterDronesUnlocked && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-evolve-textMain" />
                <span className="text-sm font-bold">采集无人机</span>
              </div>
              <span className="font-mono text-evolve-accent">{formatNumber(harvesterDrones)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono opacity-70">造价: {formatNumber(harvesterDroneCost)} 件</span>
              <button 
                className="btn-evolve text-xs py-1 px-3"
                onClick={buyHarvesterDrone}
                disabled={unsoldInventory < harvesterDroneCost}
              >
                组装
              </button>
            </div>
          </div>
        )}

        {wireDronesUnlocked && (
          <>
            <div className="h-px bg-evolve-border w-full my-1"></div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Combine className="w-4 h-4 text-evolve-textMain" />
                  <span className="text-sm font-bold">拉丝无人机</span>
                </div>
                <span className="font-mono text-evolve-accent">{formatNumber(wireDrones)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono opacity-70">造价: {formatNumber(wireDroneCost)} 件</span>
                <button 
                  className="btn-evolve text-xs py-1 px-3"
                  onClick={buyWireDrone}
                  disabled={unsoldInventory < wireDroneCost}
                >
                  组装
                </button>
              </div>
            </div>
          </>
        )}

        {factoriesUnlocked && (
          <>
            <div className="h-px bg-evolve-border w-full my-1"></div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-evolve-warning" />
                  <span className="text-sm font-bold text-evolve-warning">回形针工厂</span>
                </div>
                <span className="font-mono text-evolve-warning">{formatNumber(factories)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono opacity-70">造价: {formatNumber(factoryCost)} 件</span>
                <button 
                  className="btn-evolve btn-evolve-warning text-xs py-1 px-3"
                  onClick={buyFactory}
                  disabled={unsoldInventory < factoryCost}
                >
                  组装
                </button>
              </div>
            </div>
          </>
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
                <div className="flex justify-between text-xs font-mono text-evolve-textDim">
                  <span>思考: {Math.max(0, 200 - sliderPos)}%</span>
                  <span>工作: {Math.max(0, sliderPos)}%</span>
                </div>
              </div>
              <span className="text-[10px] text-evolve-textDim opacity-70">
                调整无人机的算力分配。偏向"思考"获取更多算力，偏向"工作"加快采集与生产。
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
};