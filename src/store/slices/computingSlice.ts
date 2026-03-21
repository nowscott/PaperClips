import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface ComputingSlice {
  trust: number;
  availableTrust: number;
  nextTrustStage: number;
  processors: number;
  memory: number;
  ops: number;
  tempOps: number; // 新增：临时算力（可超过上限）
  maxOps: number;
  qChips: number;
  qComputingUnlocked: boolean;
  creativity: number;
  creativityOn: boolean;
  compAndProjectsUnlocked: boolean;
  fib1: number;
  fib2: number;
  creativityCounter: number;
  opFade: number; // 新增：临时算力衰减率
  opFadeTimer: number; // 新增：临时算力衰减计时
  addProcessor: () => void;
  addMemory: () => void;
  addOps: (amount: number) => void;
}

export const initialComputingState = {
  trust: 0,
  availableTrust: 0,
  nextTrustStage: 3000,
  processors: 1,
  memory: 1,
  ops: 0,
  tempOps: 0,
  maxOps: 1000,
  qChips: 0,
  qComputingUnlocked: false,
  creativity: 0,
  creativityOn: false,
  compAndProjectsUnlocked: false,
  fib1: 2,
  fib2: 3,
  creativityCounter: 0,
  opFade: 0,
  opFadeTimer: 0,
};

export const createComputingSlice: StateCreator<GameState, [], [], ComputingSlice> = (set) => ({
  ...initialComputingState,
  addProcessor: () => set((state: GameState) => {
    if (state.availableTrust > 0 || state.swarmGiftsAvailable > 0) {
      const useGift = state.availableTrust <= 0;
      return {
        processors: state.processors + 1,
        availableTrust: useGift ? state.availableTrust : state.availableTrust - 1,
        swarmGiftsAvailable: useGift ? state.swarmGiftsAvailable - 1 : state.swarmGiftsAvailable
      };
    }
    return state;
  }),
  addMemory: () => set((state: GameState) => {
    if (state.availableTrust > 0 || state.swarmGiftsAvailable > 0) {
      const useGift = state.availableTrust <= 0;
      const newMemory = state.memory + 1;
      return {
        memory: newMemory,
        availableTrust: useGift ? state.availableTrust : state.availableTrust - 1,
        swarmGiftsAvailable: useGift ? state.swarmGiftsAvailable - 1 : state.swarmGiftsAvailable,
        maxOps: newMemory * 1000 
      };
    }
    return state;
  }),
  addOps: (amount: number) => set((state: GameState) => {
    // 对齐原版量子计算增加算力的逻辑
    let newStandardOps = state.ops + amount;
    let newTempOps = state.tempOps;
    
    if (newStandardOps > state.maxOps) {
      // 超过部分转为临时算力 (原版逻辑: tempOps = tempOps + Math.ceil(qq/damper) - buffer)
      // 这里简化处理：直接将超过部分加入 tempOps
      newTempOps += (newStandardOps - state.maxOps);
      newStandardOps = state.maxOps;
    }
    
    return {
      ops: newStandardOps,
      tempOps: newTempOps,
      opFade: 1, // 触发衰减
      opFadeTimer: 0
    };
  }),
});