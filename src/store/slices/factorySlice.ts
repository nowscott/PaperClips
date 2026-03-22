import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface FactorySlice {
  nanoWireUnlocked: boolean;
  harvesterDronesUnlocked: boolean;
  wireDronesUnlocked: boolean;
  factoriesUnlocked: boolean;
  solarFarmsUnlocked: boolean;
  
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
  
  // 电力系统
  solarFarms: number;
  solarFarmCost: number;
  batteries: number;
  batteryCost: number;
  maxStorage: number;
  currentStorage: number;
  totalPowerGenerated: number;
  totalPowerConsumed: number;
  powerProductionRatio: number; // 0-1 之间的效率系数

  buyHarvesterDrone: (amount?: number) => void;
  buyWireDrone: (amount?: number) => void;
  buyFactory: (amount?: number) => void;
  buySolarFarm: (amount?: number) => void;
  buyBattery: (amount?: number) => void;
}

export const initialFactoryState = {
  nanoWireUnlocked: false,
  harvesterDronesUnlocked: false,
  wireDronesUnlocked: false,
  factoriesUnlocked: false,
  solarFarmsUnlocked: false,
  
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

  // 电力系统初始化
  solarFarms: 0,
  solarFarmCost: 10000000,
  batteries: 0,
  batteryCost: 1000000,
  maxStorage: 10000,
  currentStorage: 10000,
  totalPowerGenerated: 0,
  totalPowerConsumed: 0,
  powerProductionRatio: 1,
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
  
  buyHarvesterDrone: (amount = 1) => set((state: GameState) => {
    let currentInventory = state.unsoldInventory;
    let currentDrones = state.harvesterDrones;
    let currentCost = state.harvesterDroneCost;
    
    for (let i = 0; i < amount; i++) {
      if (currentInventory >= currentCost) {
        currentInventory -= currentCost;
        currentDrones += 1;
        currentCost = Math.pow(currentDrones + 1, 2.25) * 1000000;
      } else break;
    }
    return { 
      harvesterDrones: currentDrones, 
      unsoldInventory: currentInventory, 
      harvesterDroneCost: currentCost 
    };
  }),
  
  buyWireDrone: (amount = 1) => set((state: GameState) => {
    let currentInventory = state.unsoldInventory;
    let currentDrones = state.wireDrones;
    let currentCost = state.wireDroneCost;
    
    for (let i = 0; i < amount; i++) {
      if (currentInventory >= currentCost) {
        currentInventory -= currentCost;
        currentDrones += 1;
        currentCost = Math.pow(currentDrones + 1, 2.25) * 1000000;
      } else break;
    }
    return { 
      wireDrones: currentDrones, 
      unsoldInventory: currentInventory, 
      wireDroneCost: currentCost 
    };
  }),
  
  buyFactory: (amount = 1) => set((state: GameState) => {
    let currentInventory = state.unsoldInventory;
    let currentFactories = state.factories;
    let currentCost = state.factoryCost;
    
    for (let i = 0; i < amount; i++) {
      if (currentInventory >= currentCost) {
        currentInventory -= currentCost;
        currentFactories += 1;
        
        // 原版工厂价格的分段衰减系数逻辑
        let fcmod = 1;
        if (currentFactories > 0 && currentFactories < 8) fcmod = 11 - currentFactories;
        else if (currentFactories > 7 && currentFactories < 13) fcmod = 2;
        else if (currentFactories > 12 && currentFactories < 20) fcmod = 1.5;
        else if (currentFactories > 19 && currentFactories < 39) fcmod = 1.25;
        else if (currentFactories > 38 && currentFactories < 79) fcmod = 1.15;
        else fcmod = 1.10;

        currentCost = Math.ceil(currentCost * fcmod);
      } else break;
    }
    return { 
      factories: currentFactories, 
      unsoldInventory: currentInventory, 
      factoryCost: currentCost 
    };
  }),

  buySolarFarm: (amount = 1) => set((state: GameState) => {
    let currentInventory = state.unsoldInventory;
    let currentFarms = state.solarFarms;
    let currentCost = state.solarFarmCost;
    
    for (let i = 0; i < amount; i++) {
      if (currentInventory >= currentCost) {
        currentInventory -= currentCost;
        currentFarms += 1;
        // 原版中太阳能电站价格按 1.1x 指数增长
        currentCost = Math.ceil(currentCost * 1.1);
      } else break;
    }
    return { 
      solarFarms: currentFarms, 
      unsoldInventory: currentInventory, 
      solarFarmCost: currentCost 
    };
  }),

  buyBattery: (amount = 1) => set((state: GameState) => {
    let currentInventory = state.unsoldInventory;
    let currentBatteries = state.batteries;
    let currentCost = state.batteryCost;
    
    for (let i = 0; i < amount; i++) {
      if (currentInventory >= currentCost) {
        currentInventory -= currentCost;
        currentBatteries += 1;
        // 原版中蓄电池价格按 1.1x 指数增长
        currentCost = Math.ceil(currentCost * 1.1);
      } else break;
    }
    // 每块蓄电池提供 10,000 MWs 的存储容量
    const nextMaxStorage = initialFactoryState.maxStorage + currentBatteries * 10000;
    return { 
      batteries: currentBatteries, 
      unsoldInventory: currentInventory, 
      batteryCost: currentCost,
      maxStorage: nextMaxStorage
    };
  }),
});