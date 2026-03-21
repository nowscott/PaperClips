import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export type StrategyType = 'RANDOM' | 'A100' | 'B100' | 'GREEDY' | 'GENEROUS' | 'MINIMAX' | 'TIT_FOR_TAT' | 'BEAT_LAST';

export interface StrategySlice {
  strategyEngineUnlocked: boolean;
  yomi: number;
  
  // 锦标赛状态
  tourneyInProg: boolean;
  tourneyCost: number;
  currentStrategy: StrategyType;
  unlockedStrategies: StrategyType[];
  
  // 比赛进行中的详细状态 (用于UI渲染进度条和矩阵)
  tourneyProgress: number; // 0 - 100
  matchResults: number[][]; // [策略索引][对手索引] = 得分
  
  // Actions
  setStrategy: (strategy: StrategyType) => void;
  runTourney: () => void;
  unlockStrategy: (strategy: StrategyType) => void;
}

export const initialStrategyState: Omit<StrategySlice, 'setStrategy' | 'runTourney' | 'unlockStrategy'> = {
  strategyEngineUnlocked: false,
  yomi: 0,
  tourneyInProg: false,
  tourneyCost: 1000,
  currentStrategy: 'RANDOM',
  unlockedStrategies: ['RANDOM'],
  tourneyProgress: 0,
  matchResults: [],
};

export const createStrategySlice: StateCreator<GameState, [], [], StrategySlice> = (set) => ({
  ...initialStrategyState,
  
  setStrategy: (strategy: StrategyType) => set({ currentStrategy: strategy }),
  
  unlockStrategy: (strategy: StrategyType) => set((state: GameState) => ({
    unlockedStrategies: state.unlockedStrategies.includes(strategy) 
      ? state.unlockedStrategies 
      : [...state.unlockedStrategies, strategy]
  })),

  runTourney: () => set((state: GameState) => {
    const totalOps = state.ops + state.tempOps;
    if (totalOps >= state.tourneyCost && !state.tourneyInProg) {
      let newOps = state.ops;
      let newTempOps = state.tempOps;
      
      if (newOps >= state.tourneyCost) {
        newOps -= state.tourneyCost;
      } else {
        const remaining = state.tourneyCost - newOps;
        newOps = 0;
        newTempOps = Math.max(0, newTempOps - remaining);
      }

      return {
        ops: newOps,
        tempOps: newTempOps,
        tourneyInProg: true,
        tourneyProgress: 0,
        matchResults: [],
      };
    }
    return state;
  }),
});