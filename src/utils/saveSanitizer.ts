import type { GameState } from '../store/gameStore';
import { INITIAL_PROJECTS } from '../data/projects';
import { initialBusinessState } from '../store/slices/businessSlice';
import { initialFactoryState } from '../store/slices/factorySlice';
import { initialManufacturingState } from '../store/slices/manufacturingSlice';
import { initialSpaceState } from '../store/slices/spaceSlice';

/**
 * 检查单个项目是否缺少前置条件（用于 UI 显示警告）
 */
export const checkIsAbnormal = (projectId: string, state: GameState): { isAbnormal: boolean, reason?: string } => {
  const project = INITIAL_PROJECTS.find(p => p.id === projectId);
  if (!project) return { isAbnormal: false };

  const fnStr = project.isUnlocked.toString();
  
  // 1. 检查直接的项目依赖: completedProjects.includes('xxx')
  const reqMatches = [...fnStr.matchAll(/completedProjects\.includes\(['"]([^'"]+)['"]\)/g)];
  for (const match of reqMatches) {
    const requiredProjectId = match[1];
    if (!state.completedProjects.includes(requiredProjectId)) {
      const reqProject = INITIAL_PROJECTS.find(p => p.id === requiredProjectId);
      return { isAbnormal: true, reason: `缺少前置项目: ${reqProject?.title || requiredProjectId}` };
    }
  }

  // 2. 检查由其他项目解锁的科技标记: state.xxxUnlocked
  const flagMatches = [...fnStr.matchAll(/state\.([a-zA-Z0-9_]+Unlocked)/g)];
  for (const match of flagMatches) {
    const flagName = match[1] as keyof GameState;
    if (!state[flagName]) {
      return { isAbnormal: true, reason: `缺少前置科技标记: ${flagName}` };
    }
  }

  return { isAbnormal: false };
};

/**
 * 执行全局存档修复：不仅修复非法项目，还修复游戏中所有硬性阶段顺序和逻辑
 * @returns { updates: Partial<GameState>, reasons: string[] } 修复后的状态更新对象及修复原因列表
 */
export const sanitizeSaveData = (state: GameState): { updates: Partial<GameState>, reasons: string[] } => {
  const updates: Partial<GameState> = {};
  const reasons: string[] = [];
  
  // ==========================================
  // 第一步：修复项目依赖 (Project Dependencies)
  // ==========================================
  let currentCompleted = [...state.completedProjects];
  let hasProjectChanges = true;
  
  while (hasProjectChanges) {
    hasProjectChanges = false;
    const validProjects = currentCompleted.filter(projectId => {
      const project = INITIAL_PROJECTS.find(p => p.id === projectId);
      if (!project) return false;

      const fnStr = project.isUnlocked.toString();
      
      const reqMatches = [...fnStr.matchAll(/completedProjects\.includes\(['"]([^'"]+)['"]\)/g)];
      for (const match of reqMatches) {
        if (!currentCompleted.includes(match[1])) return false;
      }

      const flagMatches = [...fnStr.matchAll(/state\.([a-zA-Z0-9_]+Unlocked)/g)];
      for (const match of flagMatches) {
        if (!state[match[1] as keyof GameState] && !updates[match[1] as keyof GameState]) {
          return false;
        }
      }
      
      return true;
    });

    if (validProjects.length !== currentCompleted.length) {
      hasProjectChanges = true;
      const removedProjects = currentCompleted.filter(id => !validProjects.includes(id));
      
      removedProjects.forEach(projectId => {
        const p = INITIAL_PROJECTS.find(proj => proj.id === projectId);
        reasons.push(`移除了非法解锁的项目: ${p?.title || projectId} (缺少前置条件)`);
        
        if (projectId.startsWith('strategy')) {
          const strategyMap: Record<string, string> = {
            'strategyA100': 'A100', 'strategyB100': 'B100', 'strategyGreedy': 'GREEDY',
            'strategyGenerous': 'GENEROUS', 'strategyMinimax': 'MINIMAX',
            'strategyTitForTat': 'TIT_FOR_TAT', 'strategyBeatLast': 'BEAT_LAST',
          };
          const stratToRemove = strategyMap[projectId];
          if (stratToRemove) {
            const currentStrats = updates.unlockedStrategies || state.unlockedStrategies;
            updates.unlockedStrategies = currentStrats.filter(s => s !== stratToRemove);
            const currentCost = updates.tourneyCost ?? state.tourneyCost;
            updates.tourneyCost = Math.max(1000, currentCost - 1000);
            reasons.push(`- 已扣除策略 [${stratToRemove}] 的锦标赛成本并移出下拉列表`);
          }
        }
        if (projectId === 'theoryOfMind') {
          updates.theoryOfMindUnlocked = false;
          const currentCost = updates.tourneyCost ?? state.tourneyCost;
          updates.tourneyCost = Math.max(1000, Math.floor(currentCost / 2));
          reasons.push(`- 已撤销 [心智理论] 的成本翻倍效果`);
        }
        if (projectId === 'hypnoDrones') updates.hypnoDronesUnlocked = false;
        if (projectId === 'releaseTheHypnoDrones') updates.hypnoDronesReleased = false;
        if (projectId === 'autoBuyer') updates.hasWireBuyer = false;
        if (projectId === 'megaClippers') updates.megaClippersUnlocked = false;
      });
      
      currentCompleted = validProjects;
    }
  }

  if (currentCompleted.length !== state.completedProjects.length) {
    updates.completedProjects = currentCompleted;
  }

  // ==========================================
  // 第二步：修复游戏阶段与硬性逻辑冲突
  // ==========================================
  
  // 1. 催眠无人机释放前的逻辑约束 (Phase 1 -> Phase 2)
  const isHypnoReleased = updates.hypnoDronesReleased ?? state.hypnoDronesReleased;
  if (!isHypnoReleased) {
    // 如果没有释放催眠无人机，就不应该有任何无人机或工厂
    if (state.harvesterDrones > 0 || state.wireDrones > 0 || state.factories > 0) {
      updates.harvesterDrones = initialFactoryState.harvesterDrones;
      updates.harvesterDroneCost = initialFactoryState.harvesterDroneCost;
      updates.wireDrones = initialFactoryState.wireDrones;
      updates.wireDroneCost = initialFactoryState.wireDroneCost;
      updates.factories = initialFactoryState.factories;
      updates.factoryCost = initialFactoryState.factoryCost;
      updates.availableMatter = 6000000000000000000000; // 修复时恢复正确的地球物质
      reasons.push(`修复阶段冲突: 催眠无人机未释放，已清空所有无人机和工厂数据`);
    }
    
    // 如果没有释放无人机，但物质不是初始值且也没有无人机（或者因为之前版本导致了坏数据）
    if (state.availableMatter !== 6000000000000000000000 && state.harvesterDrones === 0 && !updates.availableMatter) {
      updates.availableMatter = 6000000000000000000000;
      reasons.push(`修复数据损坏: 催眠无人机未释放，已重置地球物质为初始值 (6.00 Octillion)`);
    }

    // 不应该解锁太空阶段
    if (state.spaceExplorationUnlocked) {
      updates.spaceExplorationUnlocked = false;
      updates.probes = initialSpaceState.probes;
      reasons.push(`修复阶段冲突: 催眠无人机未释放，已关闭太空探索面板`);
    }
  }

  // 2. 催眠无人机释放后的逻辑约束 (Phase 2+)
  if (isHypnoReleased) {
    // 释放后，旧版的制造机和资金已经失去意义，应避免后台逻辑继续运算或产生残留数据
    let hasPhase2Clear = false;
    if (state.funds > 0) { updates.funds = 0; hasPhase2Clear = true; }
    if (state.autoClippers > 0) { updates.autoClippers = 0; hasPhase2Clear = true; }
    if (state.megaClippers > 0) { updates.megaClippers = 0; hasPhase2Clear = true; }
    if (state.investmentBankroll > 0) { updates.investmentBankroll = 0; hasPhase2Clear = true; }
    
    if (hasPhase2Clear) {
      reasons.push(`清理后台冗余: 已进入第二阶段，强制清零旧版资金和制造机后台数据`);
    }

    // 如果总物质因为老版本代码停留在一个错误的值（例如 1000000000000000000），且还没有开始消耗（或者消耗极少导致不到 6 Octillion），强制重置
    // 但必须确保不会误伤那些已经挖了半个地球的玩家
    // 如果可用物质+已采集物质 的总和明显不等于 6 Octillion，说明初始池子不对
    const currentTotalMatter = state.availableMatter + state.acquiredMatter;
    const targetEarthMatter = 6000000000000000000000;
    // 如果总和相差很大（比如因为老代码只有 1e18，而新代码是 6e21，差距达到 1000 倍以上）
    if (Math.abs(currentTotalMatter - targetEarthMatter) > 1000000000000000000) {
      // 重新调整可用物质，保留玩家已经挖到的量，只要不超过地球总质量就行
      // 但这里我们用 state.acquiredMatter + state.wire 来近似估算玩家已经从地球上挖走的物质
      const totalExcavated = state.acquiredMatter + state.wire;
      updates.availableMatter = Math.max(0, targetEarthMatter - totalExcavated);
      reasons.push(`修复数据损坏: 检测到旧版地球总物质异常，已扩充至 6.00 Octillion (已扣除您当前挖掘量)`);
    }
    
    // 如果还没解锁纳米线材，却有了无人机，强制清零无人机
    const hasNanoWire = currentCompleted.includes('nanoWireProduction');
    if (!hasNanoWire && (state.harvesterDrones > 0 || state.wireDrones > 0)) {
      updates.harvesterDrones = 0;
      updates.wireDrones = 0;
      reasons.push(`修复逻辑冲突: 纳米线材未研发，已清零错误获取的无人机`);
    }
  }

  // 3. 太空阶段约束 (Phase 3+)
  const isSpaceUnlocked = updates.spaceExplorationUnlocked ?? state.spaceExplorationUnlocked;
  if (!isSpaceUnlocked) {
    // 没解锁太空阶段，就不应该有探测器数据
    if (state.probes > 0 || state.universeExplored > 0 || state.honor > 0) {
      updates.probes = initialSpaceState.probes;
      updates.universeExplored = initialSpaceState.universeExplored;
      updates.honor = initialSpaceState.honor;
      updates.probeSpeed = initialSpaceState.probeSpeed;
      updates.probeExploration = initialSpaceState.probeExploration;
      updates.probeReplication = initialSpaceState.probeReplication;
      updates.probeHazard = initialSpaceState.probeHazard;
      updates.probeFactory = initialSpaceState.probeFactory;
      updates.probeHarvester = initialSpaceState.probeHarvester;
      updates.probeWire = initialSpaceState.probeWire;
      updates.probeCombat = initialSpaceState.probeCombat;
      reasons.push(`修复阶段冲突: 太空探索未解锁，已清空所有太空与探测器数据`);
    }
  }

  // 4. 数据一致性检查 (Cost Recovery)
  // 修复可能因为 NaN 或错误计算导致的价格异常
  if (isNaN(state.wireCost) || state.wireCost <= 0) {
    updates.wireCost = initialManufacturingState.wireCost;
    reasons.push(`修复数据损坏: 铁丝价格异常，已重置为初始值`);
  }
  if (isNaN(state.autoClipperCost) || state.autoClipperCost <= 0) {
    updates.autoClipperCost = initialManufacturingState.autoClipperCost;
    reasons.push(`修复数据损坏: 自动制造机价格异常，已重置为初始值`);
  }
  if (isNaN(state.marketingCost) || state.marketingCost <= 0) {
    updates.marketingCost = initialBusinessState.marketingCost;
    reasons.push(`修复数据损坏: 营销成本异常，已重置为初始值`);
  }

  // 修复无人机和工厂造价
  // 根据原版逻辑，无人机的价格是 Math.pow((level+1), 2.25) * 1000000
  const expectedHarvesterCost = Math.pow(state.harvesterDrones + 1, 2.25) * 1000000;
  if (Math.abs(state.harvesterDroneCost - expectedHarvesterCost) / Math.max(1, expectedHarvesterCost) > 0.05) {
    updates.harvesterDroneCost = expectedHarvesterCost;
    reasons.push(`修复数据损坏: 采集无人机造价与等级不匹配，已重置为正确曲线`);
  }

  const expectedWireCost = Math.pow(state.wireDrones + 1, 2.25) * 1000000;
  if (Math.abs(state.wireDroneCost - expectedWireCost) / Math.max(1, expectedWireCost) > 0.05) {
    updates.wireDroneCost = expectedWireCost;
    reasons.push(`修复数据损坏: 拉丝无人机造价与等级不匹配，已重置为正确曲线`);
  }

  // 修复工厂造价 (原版工厂是阶梯式的 fcmod 乘法，但为了能够修复旧版损坏数据，我们重新推演它)
  let expectedFactoryCost = 100000000;
  for (let i = 1; i <= state.factories; i++) {
    let fcmod = 1;
    if (i > 0 && i < 8) fcmod = 11 - i;
    else if (i > 7 && i < 13) fcmod = 2;
    else if (i > 12 && i < 20) fcmod = 1.5;
    else if (i > 19 && i < 39) fcmod = 1.25;
    else if (i > 38 && i < 79) fcmod = 1.15;
    else fcmod = 1.10;
    expectedFactoryCost = Math.ceil(expectedFactoryCost * fcmod);
  }
  
  if (Math.abs(state.factoryCost - expectedFactoryCost) / Math.max(1, expectedFactoryCost) > 0.05) {
    updates.factoryCost = expectedFactoryCost;
    reasons.push(`修复数据损坏: 工厂造价与等级不匹配，已重置为正确曲线`);
  }

  return { updates, reasons };
};