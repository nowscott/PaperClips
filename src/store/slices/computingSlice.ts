import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface ComputingSlice {
  trust: number;
  availableTrust: number;
  nextTrustStage: number;
  processors: number;
  memory: number;
  ops: number;
  maxOps: number;
  qChips: number;
  qComputingUnlocked: boolean;
  creativity: number;
  creativityOn: boolean;
  compAndProjectsUnlocked: boolean;
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
  maxOps: 1000,
  qChips: 0,
  qComputingUnlocked: false,
  creativity: 0,
  creativityOn: false,
  compAndProjectsUnlocked: false,
};

export const createComputingSlice: StateCreator<GameState, [], [], ComputingSlice> = (set) => ({
  ...initialComputingState,
  addProcessor: () => set((state: GameState) => {
    if (state.availableTrust > 0) {
      return {
        processors: state.processors + 1,
        availableTrust: state.availableTrust - 1
      };
    }
    return state;
  }),
  addMemory: () => set((state: GameState) => {
    if (state.availableTrust > 0) {
      const newMemory = state.memory + 1;
      return {
        memory: newMemory,
        availableTrust: state.availableTrust - 1,
        maxOps: newMemory * 1000 
      };
    }
    return state;
  }),
  addOps: (amount: number) => set((state: GameState) => {
    return {
      ops: Math.min(state.maxOps, state.ops + amount)
    };
  }),
});