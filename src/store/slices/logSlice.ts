import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';
import type { LogMessage } from '../gameStore';

export interface LogSlice {
  logs: LogMessage[];
  addLog: (text: string) => void;
}

export const initialLogState = {
  logs: [
    { id: 'init', text: '系统启动中...', timestamp: Date.now() },
    { id: 'welcome', text: '欢迎来到通用回形针', timestamp: Date.now() + 1 }
  ],
};

export const createLogSlice: StateCreator<GameState, [], [], LogSlice> = (set) => ({
  ...initialLogState,
  addLog: (text: string) => set((state: GameState) => {
    const newLog = { id: Math.random().toString(36).substr(2, 9), text, timestamp: Date.now() };
    const newLogs = [...state.logs, newLog].slice(-50);
    return { logs: newLogs };
  }),
});