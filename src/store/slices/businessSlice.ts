import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface BusinessSlice {
  price: number;
  publicDemand: number;
  marketingLevel: number;
  marketingCost: number;
  revenuePerSecond: number;
  salesPerSecond: number; // 新增：每秒销售量
  revTrackerUnlocked: boolean;
  raisePrice: () => void;
  lowerPrice: () => void;
  upgradeMarketing: () => void;
}

export const initialBusinessState = {
  price: 0.25,
  publicDemand: 32,
  marketingLevel: 1,
  marketingCost: 100,
  revenuePerSecond: 0,
  salesPerSecond: 0,
  revTrackerUnlocked: false,
};

export const createBusinessSlice: StateCreator<GameState, [], [], BusinessSlice> = (set) => ({
  ...initialBusinessState,
  raisePrice: () => set((state: GameState) => ({ 
    price: parseFloat((state.price + 0.01).toFixed(2)),
    publicDemand: Math.max(1, state.publicDemand - 2)
  })),
  lowerPrice: () => set((state: GameState) => ({ 
    price: Math.max(0.01, parseFloat((state.price - 0.01).toFixed(2))),
    publicDemand: Math.min(100, state.publicDemand + 2)
  })),
  upgradeMarketing: () => set((state: GameState) => {
    if (state.funds >= state.marketingCost) {
      return {
        marketingLevel: state.marketingLevel + 1,
        funds: state.funds - state.marketingCost,
        marketingCost: state.marketingCost * 2,
        publicDemand: Math.floor(state.publicDemand * 1.1)
      };
    }
    return state;
  }),
});