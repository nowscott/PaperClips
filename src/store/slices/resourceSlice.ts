import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface ResourceSlice {
  clips: number;
  unsoldInventory: number;
  funds: number;
  wire: number;
  wirePurchaseCount: number; // 记录玩家手动购买铁丝的次数
  makePaperclip: () => void;
}

export const initialResourceState = {
  clips: 0,
  totalClipsProduced: 0,
  unsoldInventory: 0,
  funds: 0,
  wire: 1000,
  wirePurchaseCount: 0,
};
export const createResourceSlice: StateCreator<GameState, [], [], ResourceSlice> = (set) => ({
  ...initialResourceState,
  makePaperclip: () => set((state: GameState) => {
    if (state.wire >= 1) {
      return {
        clips: state.clips + 1,
        unsoldInventory: state.unsoldInventory + 1,
        wire: state.wire - 1,
        unusedClips: state.tothFlag ? state.unusedClips + 1 : state.unusedClips
      };
    }
    return state;
  }),
});