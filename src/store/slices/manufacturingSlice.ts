import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface ManufacturingSlice {
  wireCost: number;
  prevWireCost: number;
  wireSupply: number;
  autoClippers: number;
  autoClipperCost: number;
  clipperBoost: number;
  megaClippersUnlocked: boolean;
  megaClippers: number;
  megaClipperCost: number;
  hasWireBuyer: boolean;
  wireBuyerOn: boolean; // 新增：自动进货机的开关状态
  clipsPerSecond: number; // 新增：每秒制造量统计
  buyWire: () => void;
  toggleWireBuyer: () => void; // 新增：切换自动进货机开关
  // 新增：未使用的回形针（用于建造工厂等）
  unusedClips: number;
  clipFactories: number;
  factoryCost: number;

  buyAutoClipper: () => void;
  buyMegaClipper: () => void;
  buyFactory: () => void;
}

export const initialManufacturingState = {
  wireCost: 20,
  prevWireCost: 20,
  wireSupply: 1000,
  autoClippers: 0,
  autoClipperCost: 5.00,
  clipperBoost: 1,
  megaClippersUnlocked: false,
  megaClippers: 0,
  megaClipperCost: 500,
  hasWireBuyer: false,
  wireBuyerOn: true,
  clipsPerSecond: 0,
  clipFactories: 0,
  factoryCost: 100000000,
  unusedClips: 0,
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
  buyAutoClipper: () => set((state: GameState) => {
    if (state.funds >= state.autoClipperCost) {
      const nextLevel = state.autoClippers + 1;
      return {
        autoClippers: nextLevel,
        funds: state.funds - state.autoClipperCost,
        autoClipperCost: parseFloat((Math.pow(1.1, nextLevel) + 5).toFixed(2))
      }
    }
    return state;
  }),
  buyMegaClipper: () => set((state: GameState) => {
    if (state.funds >= state.megaClipperCost) {
      const nextLevel = state.megaClippers + 1;
      return {
        megaClippers: nextLevel,
        funds: state.funds - state.megaClipperCost,
        megaClipperCost: parseFloat((Math.pow(1.07, nextLevel) * 1000).toFixed(2))
      }
    }
    return state;
  }),
  buyFactory: () => set((state: GameState) => {
    if (state.unusedClips >= state.factoryCost) {
      return {
        unusedClips: state.unusedClips - state.factoryCost,
        clipFactories: state.clipFactories + 1,
        // 根据原版逻辑，这里需要增加价格等，这里简化处理只涨价或保持原样
        factoryCost: state.factoryCost // 原版前几级工厂造价相同
      };
    }
    return state;
  }),
});