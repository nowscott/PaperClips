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
      
      // 如果项目影响了需求相关的系数，需要重新计算需求
      let finalUpdates = { ...updates, ...effectUpdates };
      if ('marketingEffectiveness' in effectUpdates || 'demandBoost' in effectUpdates || 'publicDemand' in effectUpdates) {
        const nextStateForDemand = { ...state, ...finalUpdates };
        // 提取 businessSlice 的公式，避免直接循环依赖导入
        const marketing = Math.pow(1.1, nextStateForDemand.marketingLevel - 1);
        let demand = (0.8 / nextStateForDemand.price) * marketing * nextStateForDemand.marketingEffectiveness * nextStateForDemand.demandBoost;
        if (nextStateForDemand.prestigeU && nextStateForDemand.prestigeU > 0) {
          demand = demand + ((demand / 10) * nextStateForDemand.prestigeU);
        }
        finalUpdates.publicDemand = Math.floor(demand * 10);
      }

      // 添加项目完成日志
      const logMsg = {
        id: Math.random().toString(36).substr(2, 9),
        text: `项目研发完成: ${project.title} (Project Completed)`,
        timestamp: Date.now()
      };
      const newLogs = [...state.logs, logMsg].slice(-50);

      return { ...state, ...finalUpdates, logs: newLogs };
    }
    return state;
  }),
});