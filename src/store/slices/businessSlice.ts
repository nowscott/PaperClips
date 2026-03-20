import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface BusinessSlice {
  price: number;
  publicDemand: number;
  marketingLevel: number;
  marketingCost: number;
  marketingEffectiveness: number;
  demandBoost: number;
  revenuePerSecond: number;
  salesPerSecond: number;
  revTrackerUnlocked: boolean;
  raisePrice: (amount?: number) => void;
  lowerPrice: (amount?: number) => void;
  upgradeMarketing: () => void;
}

export const initialBusinessState = {
  price: 0.25,
  publicDemand: 32, // 初始展示为 32%
  marketingLevel: 1,
  marketingCost: 100,
  marketingEffectiveness: 1,
  demandBoost: 1,
  revenuePerSecond: 0,
  salesPerSecond: 0,
  revTrackerUnlocked: false,
};

// 辅助函数：根据原版公式计算真实需求并更新
const updateDemand = (state: GameState): Partial<GameState> => {
  const marketing = Math.pow(1.1, state.marketingLevel - 1);
  let demand = (0.8 / state.price) * marketing * state.marketingEffectiveness * state.demandBoost;
  
  // 如果已解锁宇宙声望，增加加成 (原版: demand = demand + ((demand/10)*prestigeU))
  if (state.prestigeU && state.prestigeU > 0) {
    demand = demand + ((demand / 10) * state.prestigeU);
  }
  
  // 乘以 10 作为 UI 展示和后续计算的基准 (原版 UI 也是 demand * 10)
  return { publicDemand: Math.floor(demand * 10) };
};

export const createBusinessSlice: StateCreator<GameState, [], [], BusinessSlice> = (set) => ({
  ...initialBusinessState,
  raisePrice: (amount = 0.01) => set((state: GameState) => {
    const newPrice = parseFloat((state.price + amount).toFixed(2));
    const nextState = { ...state, price: newPrice };
    return { ...nextState, ...updateDemand(nextState as GameState) };
  }),
  lowerPrice: (amount = 0.01) => set((state: GameState) => {
    const newPrice = Math.max(0.01, parseFloat((state.price - amount).toFixed(2)));
    const nextState = { ...state, price: newPrice };
    return { ...nextState, ...updateDemand(nextState as GameState) };
  }),
  upgradeMarketing: () => set((state: GameState) => {
    if (state.funds >= state.marketingCost) {
      const nextState = {
        ...state,
        marketingLevel: state.marketingLevel + 1,
        funds: state.funds - state.marketingCost,
        marketingCost: state.marketingCost * 2,
      };
      return { ...nextState, ...updateDemand(nextState as GameState) };
    }
    return state;
  }),
});