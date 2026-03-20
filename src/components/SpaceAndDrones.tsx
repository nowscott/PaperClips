import { useGameStore } from '../store/gameStore';
import { Rocket, Factory, Plus } from 'lucide-react';

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
    
    clips,
    buyHarvesterDrone,
    buyWireDrone,
    buyFactory
  } = useGameStore();

  if (!nanoWireUnlocked) return null;

  return (
    <div className="panel flex flex-col gap-4">
      {/* 标题 */}
      <div className="flex justify-between items-center border-b border-evolve-border pb-2">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-evolve-accent" />
          <h2 className="text-lg font-bold tracking-widest uppercase">物质与无人机 (Matter & Drones)</h2>
        </div>
      </div>

      {/* 物质资源显示 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-evolve-textDim uppercase tracking-wider">可用物质 (Available Matter)</span>
          <span className="font-mono text-sm">{availableMatter.toLocaleString()} g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-evolve-textDim uppercase tracking-wider">已采集物质 (Acquired Matter)</span>
          <span className="font-mono text-sm">{acquiredMatter.toLocaleString()} g</span>
        </div>
      </div>

      <div className="h-px bg-evolve-border w-full my-1"></div>

      {/* 无人机控制 */}
      <div className="flex flex-col gap-4">
        {harvesterDronesUnlocked && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">采集无人机 (Harvester Drones)</span>
              <span className="font-mono text-evolve-accent">{harvesterDrones.toLocaleString()}</span>
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
                <span>建造无人机</span>
              </div>
              <span className="text-xs font-mono">{harvesterDroneCost.toLocaleString()} clips</span>
            </button>
          </div>
        )}

        {wireDronesUnlocked && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">铁丝加工无人机 (Wire Drones)</span>
              <span className="font-mono text-evolve-accent">{wireDrones.toLocaleString()}</span>
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
                <span>建造无人机</span>
              </div>
              <span className="text-xs font-mono">{wireDroneCost.toLocaleString()} clips</span>
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
                  <span className="text-sm font-bold text-evolve-warning">回形针工厂 (Clip Factories)</span>
                </div>
                <span className="font-mono text-evolve-warning">{factories.toLocaleString()}</span>
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
                <span className="text-xs font-mono">{factoryCost.toLocaleString()} clips</span>
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};