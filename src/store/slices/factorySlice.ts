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
  factoryRateBoost: number;
  harvesterBoost: number;
  wireDroneBoost: number;

  swarmUnlocked: boolean;
  sliderPos: number; // 0 to 200 (100 is center)
  droneBoost: number;
  setSliderPos: (pos: number) => void;
  
  // 新增：蜂群礼物机制
  swarmGiftProgress: number;
  swarmGiftsAvailable: number;
  nextSwarmGiftCost: number;
  claimSwarmGift: () => void;
  
  buyHarvesterDrone: () => void;
  buyWireDrone: () => void;
  buyFactory: () => void;
}

export const initialFactoryState = {
  nanoWireUnlocked: false,
  harvesterDronesUnlocked: false,
  wireDronesUnlocked: false,
  factoriesUnlocked: false,
  
  availableMatter: 6000000000000000000000, // 原版地球物质: 6 Octillion (6 * 10^21)
  acquiredMatter: 0,
  
  harvesterDrones: 0,
  harvesterDroneCost: 1000000, // 初始价格
  
  wireDrones: 0,
  wireDroneCost: 1000000,
  
  factories: 0,
  factoryCost: 100000000,
  factoryBoost: 1,
  factoryRateBoost: 1,
  harvesterBoost: 1,
  wireDroneBoost: 1,

  swarmUnlocked: false,
  sliderPos: 100, // 默认中间，100% Work, 100% Think
  droneBoost: 1,
  
  swarmGiftProgress: 0,
  swarmGiftsAvailable: 0,
  nextSwarmGiftCost: 10000,
};

export const createFactorySlice: StateCreator<GameState, [], [], FactorySlice> = (set) => ({
  ...initialFactoryState,

  setSliderPos: (pos: number) => set({ sliderPos: pos }),
  
  claimSwarmGift: () => set((state: GameState) => {
    if (state.swarmGiftsAvailable > 0) {
      return {
        swarmGiftsAvailable: state.swarmGiftsAvailable - 1,
        trust: state.trust + 1,
        availableTrust: state.availableTrust + 1
      };
    }
    return state;
  }),
  
  buyHarvesterDrone: () => set((state: GameState) => {
    // 使用 unsoldInventory 代替 clips
    if (state.unsoldInventory >= state.harvesterDroneCost) {
      const nextLevel = state.harvesterDrones + 1;
      return {
        harvesterDrones: nextLevel,
        unsoldInventory: state.unsoldInventory - state.harvesterDroneCost, // 扣除未使用的回形针
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
        unsoldInventory: state.unsoldInventory - state.wireDroneCost, // 扣除未使用的回形针
        wireDroneCost: Math.pow(nextLevel + 1, 2.25) * 1000000
      }
    }
    return state;
  }),
  
  buyFactory: () => set((state: GameState) => {
    // 使用 unsoldInventory 代替 clips
    if (state.unsoldInventory >= state.factoryCost) {
      const nextLevel = state.factories + 1;
      // 原版工厂价格的分段衰减系数逻辑
      let fcmod = 1;
      if (nextLevel > 0 && nextLevel < 8) fcmod = 11 - nextLevel; // 1-7台：系数从10降到4
      else if (nextLevel > 7 && nextLevel < 13) fcmod = 2;        // 8-12台：2倍
      else if (nextLevel > 12 && nextLevel < 20) fcmod = 1.5;     // 13-19台：1.5倍
      else if (nextLevel > 19 && nextLevel < 39) fcmod = 1.25;    // 20-38台：1.25倍
      else if (nextLevel > 38 && nextLevel < 79) fcmod = 1.15;    // 39-78台：1.15倍
      else fcmod = 1.10;                                          // 79台以上：1.10倍

      // 为了防止极度膨胀后的浮点精度丢失导致工厂价格停止增长，这里采用增量计算并确保至少有微小的增长
      const nextCost = Math.ceil(state.factoryCost * fcmod);

      return {
        factories: nextLevel,
        unsoldInventory: state.unsoldInventory - state.factoryCost, // 扣除未使用的回形针
        factoryCost: nextCost
      }
    }
    return state;
  }),
});