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
  factoryBoost: number;

  swarmUnlocked: boolean;
  sliderPos: number; // 0 to 200 (100 is center)
  droneBoost: number;
  setSliderPos: (pos: number) => void;
  
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
  factoryBoost: 1,

  swarmUnlocked: false,
  sliderPos: 100, // 默认中间，100% Work, 100% Think
  droneBoost: 1,
};

export const createFactorySlice: StateCreator<GameState, [], [], FactorySlice> = (set) => ({
  ...initialFactoryState,

  setSliderPos: (pos: number) => set({ sliderPos: pos }),
  
  buyHarvesterDrone: () => set((state: GameState) => {
    // 使用 unsoldInventory 代替 clips
    if (state.unsoldInventory >= state.harvesterDroneCost) {
      const nextLevel = state.harvesterDrones + 1;
      return {
        harvesterDrones: nextLevel,
        unsoldInventory: state.unsoldInventory - state.harvesterDroneCost, // 扣除未售出库存
        harvesterDroneCost: Math.pow(nextLevel + 1, 2.25) * 1000000 
      }
    }
    return state;
  }),
  
  buyWireDrone: () => set((state: GameState) => {
    // 使用 unsoldInventory 代替 clips
    if (state.unsoldInventory >= state.wireDroneCost) {
      const nextLevel = state.wireDrones + 1;
      return {
        wireDrones: nextLevel,
        unsoldInventory: state.unsoldInventory - state.wireDroneCost, // 扣除未售出库存
        wireDroneCost: Math.pow(nextLevel + 1, 2.25) * 1000000
      }
    }
    return state;
  }),
  
  buyFactory: () => set((state: GameState) => {
    // 使用 unsoldInventory 代替 clips
    if (state.unsoldInventory >= state.factoryCost) {
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
        unsoldInventory: state.unsoldInventory - state.factoryCost, // 扣除未售出库存
        factoryCost: state.factoryCost * fcmod
      }
    }
    return state;
  }),
});