import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface SpaceSlice {
  spaceExplorationUnlocked: boolean;
  oodaLoopUnlocked: boolean;
  
  // Probes & Cost
  probes: number;
  probeCost: number;
  
  // Design Points
  maxProbeTrust: number;
  
  // Probe Stats
  probeSpeed: number;
  probeExploration: number;
  probeReplication: number;
  probeHazard: number;
  probeFactory: number;
  probeHarvester: number;
  probeWire: number;
  probeCombat: number;
  swarmComputeBonus: number; // 高级蜂群计算加成
  
  // 太空阶段探索进度
  universeExplored: number; // 0 to 100
  totalMatter: number;
  foundMatter: number;
  drifterCount: number;
  probesLostCombat: number;
  probesLostDrift: number;

  // 结局状态
  victory: boolean;
  prestigeU: number; // Universe prestige
  prestigeS: number; // Sim Level prestige
  
  // 太空战与剧情
  driftersKilled: number;
  probesLostInCombat: number;
  honor: number;
  probeSurvival: number; // 从后期科技获得的基础加成
  
  // 后期科技解锁
  autoTourneyUnlocked: boolean;
  theoryOfMindUnlocked: boolean;
  nameTheBattlesUnlocked: boolean;
  combatUnlocked: boolean;
  
  // Actions
  launchProbe: () => void;
  increaseProbeStat: (statKey: keyof Pick<SpaceSlice, 'probeSpeed' | 'probeExploration' | 'probeReplication' | 'probeHazard' | 'probeFactory' | 'probeHarvester' | 'probeWire' | 'probeCombat'>) => void;
  decreaseProbeStat: (statKey: keyof Pick<SpaceSlice, 'probeSpeed' | 'probeExploration' | 'probeReplication' | 'probeHazard' | 'probeFactory' | 'probeHarvester' | 'probeWire' | 'probeCombat'>) => void;
  triggerVictory: () => void;
  resetForPrestige: (type: 'universe' | 'simLevel') => void;
}

export const initialSpaceState: Omit<SpaceSlice, 'launchProbe' | 'increaseProbeStat' | 'decreaseProbeStat' | 'triggerVictory' | 'resetForPrestige'> = {
  spaceExplorationUnlocked: false,
  oodaLoopUnlocked: false,
  probes: 0,
  probeCost: 100000000000000000, // 初始需要100,000,000,000,000,000 (100 Quadrillion) 回形针
  
  maxProbeTrust: 20, // 初始设计点数上限
  
  probeSpeed: 0,
  probeExploration: 0,
  probeReplication: 0,
  probeHazard: 0,
  probeFactory: 0,
  probeHarvester: 0,
  probeWire: 0,
  probeCombat: 0,
  swarmComputeBonus: 0,

  universeExplored: 0,
  totalMatter: Math.pow(10, 54) * 30, // 原版宇宙总物质
  foundMatter: 0,
  drifterCount: 0,
  probesLostCombat: 0,
  probesLostDrift: 0,

  victory: false,
  prestigeU: 0,
  prestigeS: 0,

  driftersKilled: 0,
  probesLostInCombat: 0,
  honor: 0,
  probeSurvival: 1,
  autoTourneyUnlocked: false,
  theoryOfMindUnlocked: false,
  nameTheBattlesUnlocked: false,
  combatUnlocked: false,
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
      return {
        [stat]: state[stat] - 1
      };
    }
    return state;
  }),

  triggerVictory: () => set({ victory: true }),

  resetForPrestige: (type: 'universe' | 'simLevel') => set((state: GameState) => {
    // 根据转生类型增加对应点数
    const newPrestigeU = type === 'universe' ? state.prestigeU + 1 : state.prestigeU;
    const newPrestigeS = type === 'simLevel' ? state.prestigeS + 1 : state.prestigeS;
    
    // 调用 store 根级别的重置方法，但保留 prestige 点数
    state.resetGame();
    
    // 因为宇宙声望改变了，需要重新计算初始公众需求
    // 初始状态下 price: 0.25, marketingLevel: 1, marketingEffectiveness: 1, demandBoost: 1
    const marketing = Math.pow(1.1, 1 - 1); // 1
    let demand = (0.8 / 0.25) * marketing * 1 * 1; // 3.2
    if (newPrestigeU > 0) {
      demand = demand + ((demand / 10) * newPrestigeU);
    }
    
    return {
      prestigeU: newPrestigeU,
      prestigeS: newPrestigeS,
      victory: false,
      publicDemand: Math.floor(demand * 10)
    };
  })
});