import { useGameStore } from '../store/gameStore';
import { Factory, Plus, Zap } from 'lucide-react';
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
    
    clips,
    buyHarvesterDrone,
    buyWireDrone,
    buyFactory
  } = useGameStore();

  if (!nanoWireUnlocked) return null;

  return (
    <div className="panel flex flex-col gap-4">
      {/* 物质资源显示 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-evolve-textDim tracking-wider">可用物质</span>
          <span className="font-mono text-sm">{formatNumber(availableMatter)} g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-evolve-textDim tracking-wider">已采集物质</span>
          <span className="font-mono text-sm">{formatNumber(acquiredMatter)} g</span>
        </div>
      </div>

      <div className="h-px bg-evolve-border w-full my-1"></div>

      {/* 无人机控制 */}
      <div className="flex flex-col gap-4">
        {harvesterDronesUnlocked && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">采集无人机</span>
              <span className="font-mono text-evolve-accent">{formatNumber(harvesterDrones)}</span>
            </div>
            <button 
              className={`btn flex items-center justify-between w-full p-2 ${
                clips >= harvesterDroneCost ? 'hover:bg-evolve-accent/10 border-evolve-accent/50' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={buyHarvesterDrone}
              disabled={clips < harvesterDroneCost}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>建造采集无人机</span>
              </div>
              <span className="text-xs font-mono">{formatNumber(harvesterDroneCost)} 件</span>
            </button>
          </div>
        )}

        {wireDronesUnlocked && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">线材加工无人机</span>
              <span className="font-mono text-evolve-accent">{formatNumber(wireDrones)}</span>
            </div>
            <button 
              className={`btn flex items-center justify-between w-full p-2 ${
                clips >= wireDroneCost ? 'hover:bg-evolve-accent/10 border-evolve-accent/50' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={buyWireDrone}
              disabled={clips < wireDroneCost}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>建造加工无人机</span>
              </div>
              <span className="text-xs font-mono">{formatNumber(wireDroneCost)} 件</span>
            </button>
          </div>
        )}

        {factoriesUnlocked && (
          <>
            <div className="h-px bg-evolve-border w-full my-1"></div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-evolve-warning" />
                  <span className="text-sm font-bold text-evolve-warning">回形针工厂</span>
                </div>
                <span className="font-mono text-evolve-warning">{formatNumber(factories)}</span>
              </div>
              <button 
                className={`btn flex items-center justify-between w-full p-2 ${
                  clips >= factoryCost ? 'hover:bg-evolve-warning/10 border-evolve-warning/50 text-evolve-warning' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={buyFactory}
                disabled={clips < factoryCost}
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>建造工厂</span>
                </div>
                <span className="text-xs font-mono">{formatNumber(factoryCost)} 件</span>
              </button>
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
                  <span>思考 (Think): {Math.max(0, 200 - sliderPos)}%</span>
                  <span>劳作 (Work): {Math.max(0, sliderPos)}%</span>
                </div>
              </div>
              <span className="text-[10px] text-evolve-textDim opacity-70">
                调整无人机的算力分配。偏向"思考"获取更多算力，偏向"劳作"加快采集与生产。
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
};