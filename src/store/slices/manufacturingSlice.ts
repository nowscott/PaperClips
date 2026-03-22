import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface ManufacturingSlice {
  wireCost: number;
  prevWireCost: number;
  wireSupply: number;
  autoClippers: number;
  autoClipperCost: number;
  clipperBoost: number;
  megaClipperBoost: number;
  megaClippersUnlocked: boolean;
  megaClippers: number;
  megaClipperCost: number;
  hasWireBuyer: boolean;
  wireBuyerOn: boolean; // 新增：自动进货机的开关状态
  clipsPerSecond: number; // 新增：每秒制造量统计
  wireConsumptionRate: number; // 新增：每秒铁丝消耗率
  buyWire: () => void;
  toggleWireBuyer: () => void; // 新增：切换自动进货机开关
  // 新增：未使用的回形针（用于建造工厂等）
  unusedClips: number;

  // 新增：记录当前产能状态以供UI显示
  harvestRate: number; // 物质采集率/秒
  wireProcessRate: number; // 铁丝加工率/秒
  factoryClipRate: number; // 工厂回形针产出率/秒

  buyAutoClipper: (amount?: number) => void;
  buyMegaClipper: (amount?: number) => void;
}

export const initialManufacturingState = {
  wireCost: 20,
  prevWireCost: 20,
  wireSupply: 1000,
  autoClippers: 0,
  autoClipperCost: 5.00,
  clipperBoost: 1,
  megaClipperBoost: 1,
  megaClippersUnlocked: false,
  megaClippers: 0,
  megaClipperCost: 1000,
  hasWireBuyer: false,
  wireBuyerOn: true,
  clipsPerSecond: 0,
  wireConsumptionRate: 0,
  unusedClips: 0,
  harvestRate: 0,
  wireProcessRate: 0,
  factoryClipRate: 0,
};

export const createManufacturingSlice: StateCreator<GameState, [], [], ManufacturingSlice> = (set) => ({
  ...initialManufacturingState,
  buyWire: () => set((state: GameState) => {
    if (state.funds >= state.wireCost) {
      return {
        funds: state.funds - state.wireCost,
        wire: state.wire + state.wireSupply,
        wirePurchaseCount: (state.wirePurchaseCount || 0) + 1
      };
    }
    return state;
  }),
  toggleWireBuyer: () => set((state: GameState) => ({ wireBuyerOn: !state.wireBuyerOn })),
  buyAutoClipper: (amount = 1) => set((state: GameState) => {
    let currentFunds = state.funds;
    let currentLevel = state.autoClippers;
    let currentCost = state.autoClipperCost;
    
    for (let i = 0; i < amount; i++) {
      if (currentFunds >= currentCost) {
        currentFunds -= currentCost;
        currentLevel += 1;
        currentCost = parseFloat((Math.pow(1.1, currentLevel) + 5).toFixed(2));
      } else break;
    }
    return {
      autoClippers: currentLevel,
      funds: currentFunds,
      autoClipperCost: currentCost
    };
  }),
  buyMegaClipper: (amount = 1) => set((state: GameState) => {
    let currentFunds = state.funds;
    let currentLevel = state.megaClippers;
    let currentCost = state.megaClipperCost;
    
    for (let i = 0; i < amount; i++) {
      if (currentFunds >= currentCost) {
        currentFunds -= currentCost;
        currentLevel += 1;
        currentCost = Math.pow(1.07, currentLevel) * 1000;
      } else break;
    }
    return {
      megaClippers: currentLevel,
      funds: currentFunds,
      megaClipperCost: currentCost
    };
  }),
});