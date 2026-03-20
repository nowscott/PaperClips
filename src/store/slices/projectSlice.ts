import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';
import { INITIAL_PROJECTS } from '../../data/projects';

export interface ProjectSlice {
  completedProjects: string[];
  completeProject: (projectId: string) => void;
}

export const initialProjectState = {
  completedProjects: [],
};

export const createProjectSlice: StateCreator<GameState, [], [], ProjectSlice> = (set) => ({
  ...initialProjectState,
  completeProject: (projectId: string) => set((state: GameState) => {
    const project = INITIAL_PROJECTS.find(p => p.id === projectId);
    if (!project || state.completedProjects.includes(projectId)) return state;
    
    const hasEnoughOps = state.ops >= project.costOps;
    const hasEnoughFunds = project.costFunds === undefined || state.funds >= project.costFunds;
    const hasEnoughCreativity = project.costCreativity === undefined || state.creativity >= project.costCreativity;
    const hasEnoughYomi = project.costYomi === undefined || state.yomi >= project.costYomi;

    if (hasEnoughOps && hasEnoughFunds && hasEnoughCreativity && hasEnoughYomi) {
      const updates: Partial<GameState> = {
        ops: state.ops - project.costOps,
        completedProjects: [...state.completedProjects, projectId],
      };
      
      if (project.costFunds) {
        updates.funds = state.funds - project.costFunds;
      }

      if (project.costCreativity) {
        updates.creativity = state.creativity - project.costCreativity;
      }
      
      if (project.costYomi) {
        updates.yomi = state.yomi - project.costYomi;
      }

      // 处理特殊项目效果
      if (projectId === 'autoBuyer') {
        updates.hasWireBuyer = true;
      }
      if (projectId === 'megaClippers') {
        updates.megaClippersUnlocked = true;
      }
      if (projectId === 'revTracker') {
        updates.revTrackerUnlocked = true;
      }

      const effectUpdates = project.effect(state);
      
      // 添加项目完成日志
      const logMsg = {
        id: Math.random().toString(36).substr(2, 9),
        text: `项目研发完成: ${project.title} (Project Completed)`,
        timestamp: Date.now()
      };
      const newLogs = [...state.logs, logMsg].slice(-50);

      return { ...state, ...updates, ...effectUpdates, logs: newLogs };
    }
    return state;
  }),
});