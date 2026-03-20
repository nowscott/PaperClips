import type { StateCreator } from 'zustand';
import type { GameState, LogMessage } from '../gameStore';

export interface LogSlice {
  logs: LogMessage[];
  addLog: (text: string) => void;
}

export const initialLogState = {
  logs: [
    { id: 'init', text: '系统启动中... (System Initializing...)', timestamp: Date.now() },
    { id: 'welcome', text: '欢迎来到通用回形针 (Welcome to Universal Paperclips)', timestamp: Date.now() + 1 }
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