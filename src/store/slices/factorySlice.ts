import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface FactorySlice {
  nanoWireUnlocked: boolean;
  harvesterDronesUnlocked: boolean;
  wireDronesUnlocked: boolean;
  factoriesUnlocked: boolean;
  
  availableMatter: number;
  acquiredMatter: number;
  
  harvesterDrones: number;
  harvesterDroneCost: number;
  
  wireDrones: number;
  wireDroneCost: number;
  
  factories: number;
  factoryCost: number;
  
  buyHarvesterDrone: () => void;
  buyWireDrone: () => void;
  buyFactory: () => void;
}

export const initialFactoryState = {
  nanoWireUnlocked: false,
  harvesterDronesUnlocked: false,
  wireDronesUnlocked: false,
  factoriesUnlocked: false,
  
  availableMatter: 1000000000000000000, // 初始地球可用物质，极大
  acquiredMatter: 0,
  
  harvesterDrones: 0,
  harvesterDroneCost: 1000000, // 初始价格
  
  wireDrones: 0,
  wireDroneCost: 1000000,
  
  factories: 0,
  factoryCost: 100000000,
};

export const createFactorySlice: StateCreator<GameState, [], [], FactorySlice> = (set) => ({
  ...initialFactoryState,
  
  buyHarvesterDrone: () => set((state: GameState) => {
    if (state.clips >= state.harvesterDroneCost) {
      const nextLevel = state.harvesterDrones + 1;
      return {
        harvesterDrones: nextLevel,
        clips: state.clips - state.harvesterDroneCost,
        harvesterDroneCost: Math.pow(nextLevel + 1, 2.25) * 1000000 
      }
    }
    return state;
  }),
  
  buyWireDrone: () => set((state: GameState) => {
    if (state.clips >= state.wireDroneCost) {
      const nextLevel = state.wireDrones + 1;
      return {
        wireDrones: nextLevel,
        clips: state.clips - state.wireDroneCost,
        wireDroneCost: Math.pow(nextLevel + 1, 2.25) * 1000000
      }
    }
    return state;
  }),
  
  buyFactory: () => set((state: GameState) => {
    if (state.clips >= state.factoryCost) {
      const nextLevel = state.factories + 1;
      let fcmod = 1;
      if (nextLevel > 0 && nextLevel < 8) fcmod = 11 - nextLevel;
      else if (nextLevel > 7 && nextLevel < 13) fcmod = 2;
      else if (nextLevel > 12 && nextLevel < 20) fcmod = 1.5;
      else if (nextLevel > 19 && nextLevel < 39) fcmod = 1.25;
      else if (nextLevel > 38 && nextLevel < 79) fcmod = 1.15;
      else fcmod = 1.10;

      return {
        factories: nextLevel,
        clips: state.clips - state.factoryCost,
        factoryCost: state.factoryCost * fcmod
      }
    }
    return state;
  }),
});