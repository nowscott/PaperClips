import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createResourceSlice, initialResourceState } from './slices/resourceSlice';
import type { ResourceSlice } from './slices/resourceSlice';
import { createBusinessSlice, initialBusinessState } from './slices/businessSlice';
import type { BusinessSlice } from './slices/businessSlice';
import { createManufacturingSlice, initialManufacturingState } from './slices/manufacturingSlice';
import type { ManufacturingSlice } from './slices/manufacturingSlice';
import { createComputingSlice, initialComputingState } from './slices/computingSlice';
import type { ComputingSlice } from './slices/computingSlice';
import { createProjectSlice, initialProjectState } from './slices/projectSlice';
import type { ProjectSlice } from './slices/projectSlice';
import { createInvestmentSlice, initialInvestmentState } from './slices/investmentSlice';
import type { InvestmentSlice } from './slices/investmentSlice';
import { createLogSlice, initialLogState } from './slices/logSlice';
import type { LogSlice } from './slices/logSlice';

import { createStrategySlice, initialStrategyState } from './slices/strategySlice';
import type { StrategySlice } from './slices/strategySlice';

import { createTickSlice } from './slices/tickSlice';
import type { TickSlice } from './slices/tickSlice';

import { createFactorySlice, initialFactoryState } from './slices/factorySlice';
import type { FactorySlice } from './slices/factorySlice';

import { createSpaceSlice, initialSpaceState } from './slices/spaceSlice';
import type { SpaceSlice } from './slices/spaceSlice';

export interface LogMessage {
  id: string;
  text: string;
  timestamp: number;
}

export type GameState = ResourceSlice &
  BusinessSlice &
  ManufacturingSlice &
  ComputingSlice &
  ProjectSlice &
  InvestmentSlice &
  StrategySlice &
  LogSlice &
  TickSlice &
  FactorySlice &
  SpaceSlice & {
    resetGame: () => void;
    triggerPrestige?: string | null;
  };

const initialState = {
  ...initialResourceState,
  ...initialBusinessState,
  ...initialManufacturingState,
  ...initialComputingState,
  ...initialProjectState,
  ...initialInvestmentState,
  ...initialStrategyState,
  ...initialLogState,
  ...initialFactoryState,
  ...initialSpaceState,
};

export const useGameStore = create<GameState>()(
  persist(
    (...a) => ({
      ...createResourceSlice(...a),
      ...createBusinessSlice(...a),
      ...createManufacturingSlice(...a),
      ...createComputingSlice(...a),
      ...createProjectSlice(...a),
      ...createInvestmentSlice(...a),
      ...createStrategySlice(...a),
      ...createLogSlice(...a),
      ...createTickSlice(...a),
      ...createFactorySlice(...a),
      ...createSpaceSlice(...a),

      // 重置游戏方法
      resetGame: () => a[0](initialState),

    }),
    {
      name: 'paperclips-storage', // localStorage 中的 key 名称
      storage: createJSONStorage(() => localStorage),
    }
  )
);