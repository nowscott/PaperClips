import { useGameStore } from '../store/gameStore';
import { Rocket, Minus, Plus } from 'lucide-react';
import type { SpaceSlice } from '../store/slices/spaceSlice';

export const SpaceExploration = () => {
  const {
    spaceExplorationUnlocked,
    probes,
    probeCost,
    probeDesignTrust,
    maxProbeTrust,
    clips,
    
    probeSpeed, probeExploration, probeReplication, probeHazard,
    probeFactory, probeHarvester, probeWire, probeCombat,
    
    universeExplored,
    
    launchProbe,
    increaseProbeStat,
    decreaseProbeStat
  } = useGameStore();

  if (!spaceExplorationUnlocked) return null;

  const totalAllocated = probeSpeed + probeExploration + probeReplication + 
    probeHazard + probeFactory + probeHarvester + probeWire + probeCombat;
    
  const availableTrust = maxProbeTrust - totalAllocated;

  const renderStatRow = (label: string, statKey: keyof Pick<SpaceSlice, 'probeSpeed' | 'probeExploration' | 'probeReplication' | 'probeHazard' | 'probeFactory' | 'probeHarvester' | 'probeWire' | 'probeCombat'>, value: number) => (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-evolve-textDim">{label}</span>
      <div className="flex items-center gap-3">
        <button 
          className="p-1 hover:bg-evolve-border rounded disabled:opacity-30"
          onClick={() => decreaseProbeStat(statKey)}
          disabled={value <= 0}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="font-mono w-4 text-center">{value}</span>
        <button 
          className="p-1 hover:bg-evolve-border rounded disabled:opacity-30"
          onClick={() => increaseProbeStat(statKey)}
          disabled={availableTrust <= 0}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="panel flex flex-col gap-4 animate-fade-in border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.1)]">
      {/* 标题 */}
      <div className="flex justify-between items-center border-b border-evolve-border pb-2">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-evolve-accent" />
          <h2 className="text-lg font-bold tracking-widest uppercase text-evolve-accent">太空探险 (Space)</h2>
        </div>
      </div>

      {/* 探索进度 */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-evolve-textDim uppercase tracking-wider">
          <span>宇宙探索进度 (Universe Explored)</span>
          <span className="font-mono">{universeExplored.toFixed(4)}%</span>
        </div>
        <div className="w-full h-1.5 bg-evolve-border rounded overflow-hidden">
          <div 
            className="h-full bg-evolve-accent transition-all duration-1000" 
            style={{ width: `${universeExplored}%` }}
          ></div>
        </div>
      </div>

      <div className="h-px bg-evolve-border w-full my-2"></div>

      {/* 探测器发射 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold">冯·诺依曼探测器 (Probes)</span>
          <span className="font-mono text-lg text-evolve-accent">{probes.toLocaleString()}</span>
        </div>
        <button 
          className={`btn flex justify-center py-2 ${
            clips >= probeCost ? 'btn-primary' : 'opacity-50 cursor-not-allowed border-evolve-border'
          }`}
          onClick={launchProbe}
          disabled={clips < probeCost}
        >
          <span>发射探测器 (Launch Probe)</span>
        </button>
        <div className="text-right text-xs font-mono text-evolve-textDim">
          成本: {probeCost.toLocaleString()} clips
        </div>
      </div>

      <div className="h-px bg-evolve-border w-full my-2"></div>

      {/* 探测器设计 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold uppercase tracking-wider">探测器设计 (Probe Design)</span>
          <span className="text-xs font-mono bg-evolve-accent/20 text-evolve-accent px-2 py-0.5 rounded">
            可用点数: {availableTrust} / {maxProbeTrust}
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 bg-evolve-bg p-3 rounded border border-evolve-border">
          {renderStatRow('速度 (Speed)', 'probeSpeed', probeSpeed)}
          {renderStatRow('探索 (Exploration)', 'probeExploration', probeExploration)}
          {renderStatRow('自我复制 (Self-Replication)', 'probeReplication', probeReplication)}
          {renderStatRow('危险规避 (Hazard Remediation)', 'probeHazard', probeHazard)}
          {renderStatRow('工厂生产 (Factory Production)', 'probeFactory', probeFactory)}
          {renderStatRow('无人机生产 (Harvester Drone Prod.)', 'probeHarvester', probeHarvester)}
          {renderStatRow('铁丝生产 (Wire Drone Prod.)', 'probeWire', probeWire)}
          {renderStatRow('战斗 (Combat)', 'probeCombat', probeCombat)}
        </div>
      </div>
    </div>
  );
};