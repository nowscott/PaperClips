import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface InvestmentSlice {
  investmentEngineUnlocked: boolean;
  investmentLevel: number;
  investmentBankroll: number;
  riskLevel: 'low' | 'med' | 'high';
  depositFunds: () => void;
  withdrawFunds: () => void;
  upgradeInvestmentEngine: () => void;
  setRiskLevel: (level: 'low' | 'med' | 'high') => void;
}

export const initialInvestmentState = {
  investmentEngineUnlocked: false,
  investmentLevel: 1,
  investmentBankroll: 0,
  riskLevel: 'low' as const,
};

export const createInvestmentSlice: StateCreator<GameState, [], [], InvestmentSlice> = (set) => ({
  ...initialInvestmentState,
  depositFunds: () => set((state: GameState) => {
    if (state.funds > 0) {
      return {
        investmentBankroll: state.investmentBankroll + state.funds,
        funds: 0
      };
    }
    return state;
  }),
  withdrawFunds: () => set((state: GameState) => {
    if (state.investmentBankroll > 0) {
      return {
        funds: state.funds + state.investmentBankroll,
        investmentBankroll: 0
      };
    }
    return state;
  }),
  upgradeInvestmentEngine: () => set((state: GameState) => {
    const upgradeCost = Math.floor(Math.pow(state.investmentLevel + 1, Math.E) * 100);
    if (state.yomi >= upgradeCost) {
      return {
        investmentLevel: state.investmentLevel + 1,
        yomi: state.yomi - upgradeCost
      };
    }
    return state;
  }),
  setRiskLevel: (level: 'low' | 'med' | 'high') => set({ riskLevel: level }),
});