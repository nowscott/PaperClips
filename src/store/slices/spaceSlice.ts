import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface SpaceSlice {
  spaceExplorationUnlocked: boolean;
  probes: number;
  probeCost: number;
  
  // 探测器设计点数
  probeDesignTrust: number;
  maxProbeTrust: number;
  
  // 已分配的点数
  probeSpeed: number;
  probeExploration: number;
  probeReplication: number;
  probeHazard: number;
  probeFactory: number;
  probeHarvester: number;
  probeWire: number;
  probeCombat: number;

  // 太空阶段探索进度
  universeExplored: number; // 0 to 100
  
  // Actions
  launchProbe: () => void;
  increaseProbeStat: (stat: keyof Pick<SpaceSlice, 'probeSpeed' | 'probeExploration' | 'probeReplication' | 'probeHazard' | 'probeFactory' | 'probeHarvester' | 'probeWire' | 'probeCombat'>) => void;
  decreaseProbeStat: (stat: keyof Pick<SpaceSlice, 'probeSpeed' | 'probeExploration' | 'probeReplication' | 'probeHazard' | 'probeFactory' | 'probeHarvester' | 'probeWire' | 'probeCombat'>) => void;
}

export const initialSpaceState: Omit<SpaceSlice, 'launchProbe' | 'increaseProbeStat' | 'decreaseProbeStat'> = {
  spaceExplorationUnlocked: false,
  probes: 0,
  probeCost: 100000000000000000, // 初始需要100,000,000,000,000,000 (100 Quadrillion) 回形针
  
  probeDesignTrust: 0,
  maxProbeTrust: 20, // 初始设计点数上限
  
  probeSpeed: 0,
  probeExploration: 0,
  probeReplication: 0,
  probeHazard: 0,
  probeFactory: 0,
  probeHarvester: 0,
  probeWire: 0,
  probeCombat: 0,

  universeExplored: 0,
};

export const createSpaceSlice: StateCreator<GameState, [], [], SpaceSlice> = (set) => ({
  ...initialSpaceState,
  
  launchProbe: () => set((state: GameState) => {
    if (state.clips >= state.probeCost) {
      return {
        probes: state.probes + 1,
        clips: state.clips - state.probeCost,
      };
    }
    return state;
  }),

  increaseProbeStat: (stat) => set((state: GameState) => {
    const totalAllocated = 
      state.probeSpeed + state.probeExploration + state.probeReplication + 
      state.probeHazard + state.probeFactory + state.probeHarvester + 
      state.probeWire + state.probeCombat;
      
    if (totalAllocated < state.maxProbeTrust) {
      return { [stat]: state[stat] + 1 };
    }
    return state;
  }),

  decreaseProbeStat: (stat) => set((state: GameState) => {
    if (state[stat] > 0) {
      return { [stat]: state[stat] - 1 };
    }
    return state;
  }),
});