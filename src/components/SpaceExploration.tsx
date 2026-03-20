import { useGameStore } from '../store/gameStore';
import { Rocket, Minus, Plus } from 'lucide-react';
import type { SpaceSlice } from '../store/slices/spaceSlice';

export const SpaceExploration = () => {
  const { 
    spaceExplorationUnlocked,
    probes,
    probeCost,
    maxProbeTrust,
    probeSpeed,
    probeExploration,
    probeReplication,
    probeHazard,
    probeFactory,
    probeHarvester,
    probeWire,
    probeCombat,
    universeExplored,
    clips,
    launchProbe,
    increaseProbeStat,
    decreaseProbeStat
  } = useGameStore();

  if (!spaceExplorationUnlocked) return null;

  const totalAllocated = probeSpeed + probeExploration + probeReplication + 
    probeHazard + probeFactory + probeHarvester + probeWire + probeCombat;
    
  const availableTrust = maxProbeTrust - totalAllocated;

  const renderStatRow = (label: string, statKey: keyof Pick<SpaceSlice, 'probeSpeed' | 'probeExploration' | 'probeReplication' | 'probeHazard' | 'probeFactory' | 'probeHarvester' | 'probeWire' | 'probeCombat'>, value: number, tooltip: string) => (
    <div className="flex flex-col py-1.5 group">
      <div className="flex justify-between items-center text-sm">
        <span className="text-evolve-textMain">{label}</span>
        <div className="flex items-center gap-2">
          <button 
            className="p-1 hover:bg-evolve-border rounded disabled:opacity-30"
            onClick={() => decreaseProbeStat(statKey)}
            disabled={value <= 0}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono w-6 text-center">{value}</span>
          <button 
            className="p-1 hover:bg-evolve-border rounded disabled:opacity-30"
            onClick={() => increaseProbeStat(statKey)}
            disabled={availableTrust <= 0}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <span className="text-[10px] text-evolve-textDim opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 leading-tight">
        {tooltip}
      </span>
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
        
        <div className="grid grid-cols-1 gap-x-4 gap-y-0 bg-evolve-bg p-3 rounded border border-evolve-border divide-y divide-evolve-border/50">
          {renderStatRow('速度 (Speed)', 'probeSpeed', probeSpeed, '修改探索速度')}
          {renderStatRow('探索 (Exploration)', 'probeExploration', probeExploration, '探测器获得新物质的速度')}
          {renderStatRow('自我复制 (Self-Replication)', 'probeReplication', probeReplication, '探测器生成新探测器的速度 (成本10亿亿)')}
          {renderStatRow('危险规避 (Hazard Remediation)', 'probeHazard', probeHazard, '减少星际尘埃、辐射和熵增造成的损耗')}
          {renderStatRow('工厂生产 (Factory Production)', 'probeFactory', probeFactory, '探测器建造工厂的速度 (成本1亿)')}
          {renderStatRow('采集无人机生产 (Harvester Drone Prod.)', 'probeHarvester', probeHarvester, '探测器建造采集无人机的速度 (成本200万)')}
          {renderStatRow('铁丝无人机生产 (Wire Drone Prod.)', 'probeWire', probeWire, '探测器建造铁丝加工无人机的速度 (成本200万)')}
          {renderStatRow('战斗 (Combat)', 'probeCombat', probeCombat, '遭遇漂流者(Drifters)时的战斗力')}
        </div>
      </div>
    </div>
  );
};