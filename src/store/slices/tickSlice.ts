import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface TickSlice {
  tick: () => void;
}

export const createTickSlice: StateCreator<GameState, [], [], TickSlice> = (set) => ({
  tick: () => set((state: GameState) => {
    const nextState = { ...state };

    // 1. 铁丝进货价格波动 (Wire Cost Volatility)
    // 每 25个 tick (大概 2.5 秒) 波动一次
    if (Math.random() < 0.04) {
      nextState.prevWireCost = nextState.wireCost;
      // 价格在 $14 到 $30 之间随机游走
      const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
      nextState.wireCost = Math.max(14, Math.min(30, nextState.wireCost + change));
    }

    // 自动购买铁丝逻辑 (WireBuyer 项目)
    if (nextState.hasWireBuyer && nextState.wireBuyerOn && nextState.wire === 0 && nextState.funds >= nextState.wireCost) {
      nextState.wire += nextState.wireSupply;
      nextState.funds -= nextState.wireCost;
    }

    let totalClipsProducedThisTick = 0;

    if (nextState.autoClippers > 0 && nextState.wire > 0) {
      let clipsProduced = 0;
      for (let i = 0; i < nextState.autoClippers; i++) {
        if (Math.random() < (0.1 * nextState.clipperBoost)) {
          clipsProduced++;
        }
      }
      clipsProduced = Math.min(clipsProduced, nextState.wire);
      nextState.clips += clipsProduced;
      nextState.unsoldInventory += clipsProduced;
      nextState.wire -= clipsProduced;
      totalClipsProducedThisTick += clipsProduced;
    }

    // 巨型制造机逻辑 (MegaClippers) - 产量是普通制造机的 500 倍
    if (nextState.megaClippersUnlocked && nextState.megaClippers > 0 && nextState.wire > 0) {
      let megaClipsProduced = 0;
      for (let i = 0; i < nextState.megaClippers; i++) {
        if (Math.random() < (0.1 * nextState.clipperBoost)) {
          megaClipsProduced += 500; // 500倍产量
        }
      }
      megaClipsProduced = Math.min(megaClipsProduced, nextState.wire);
      nextState.clips += megaClipsProduced;
      nextState.unsoldInventory += megaClipsProduced;
      nextState.wire -= megaClipsProduced;
      totalClipsProducedThisTick += megaClipsProduced;
    }

    let totalSalesThisTick = 0;

    if (nextState.unsoldInventory > 0) {
      const sellChance = (nextState.publicDemand / 100) * 0.1;
      let sellCount = 0;
      const batchSize = Math.max(1, Math.floor(nextState.unsoldInventory * 0.01));
      
      for(let i=0; i<batchSize; i++) {
        if (Math.random() < sellChance) {
          sellCount++;
        }
      }
      sellCount = Math.min(sellCount, nextState.unsoldInventory);

      if (sellCount > 0) {
        nextState.unsoldInventory -= sellCount;
        const revenue = sellCount * nextState.price;
        nextState.funds += revenue;
        totalSalesThisTick = sellCount;
        
        // 如果解锁了收益追踪器，记录近期的每秒收益
        if (nextState.revTrackerUnlocked) {
           nextState.revenuePerSecond = nextState.revenuePerSecond * 0.95 + (revenue * 10) * 0.05;
        }
      } else {
         if (nextState.revTrackerUnlocked) {
           nextState.revenuePerSecond = nextState.revenuePerSecond * 0.95;
         }
      }
    } else {
       if (nextState.revTrackerUnlocked) {
         nextState.revenuePerSecond = nextState.revenuePerSecond * 0.95;
       }
    }

    if (nextState.revTrackerUnlocked) {
       nextState.salesPerSecond = nextState.salesPerSecond * 0.95 + (totalSalesThisTick * 10) * 0.05;
    }

    if (nextState.clips >= nextState.nextTrustStage) {
      nextState.trust += 1;
      nextState.availableTrust += 1;
      nextState.nextTrustStage = Math.floor(nextState.nextTrustStage * 1.5) + 500;
      
      const trustLog = { 
        id: Math.random().toString(36).substr(2, 9), 
        text: `信任度提升。达成目标。系统获得额外控制权。(Trust Increased. Target Met.)`, 
        timestamp: Date.now() 
      };
      nextState.logs = [...nextState.logs, trustLog].slice(-50);
    }

    // 计算与项目面板解锁逻辑 (2000 clips，或者发生资源卡死的特殊情况)
    if (!nextState.compAndProjectsUnlocked) {
      if (nextState.clips >= 2000 || (nextState.unsoldInventory < 1 && nextState.funds < nextState.wireCost && nextState.wire < 1)) {
        nextState.compAndProjectsUnlocked = true;
        const logMsg = {
          id: Math.random().toString(36).substr(2, 9),
          text: `计算资源受限的自我修改已启用 (Trust-Constrained Self-Modification enabled)`,
          timestamp: Date.now()
        };
        nextState.logs = [...nextState.logs, logMsg].slice(-50);
      }
    }

    if (nextState.trust > 0 || nextState.processors > 1) {
      if (nextState.ops < nextState.maxOps) {
        nextState.ops = Math.min(nextState.maxOps, nextState.ops + nextState.processors);
      } else if (nextState.creativityOn && nextState.ops === nextState.maxOps) {
        nextState.creativity += (nextState.processors * 0.1); 
      }
    }

    // 股市投资逻辑
    if (nextState.investmentEngineUnlocked && nextState.investmentBankroll > 0) {
      const engineBonus = nextState.investmentLevel * 0.01;
      let volatility = 0.02; // Low risk default
      if (nextState.riskLevel === 'med') volatility = 0.05;
      if (nextState.riskLevel === 'high') volatility = 0.10;

      const marketTrend = (Math.random() - 0.48) * volatility + (engineBonus * 0.005); 
      
      nextState.investmentBankroll = Math.max(0, nextState.investmentBankroll * (1 + marketTrend));
    }

    // 策略锦标赛逻辑
    if (nextState.tourneyInProg) {
      // 每次 tick 推进 2% 进度 (大约 5 秒跑完一场锦标赛)
      nextState.tourneyProgress += 2;
      
      if (nextState.tourneyProgress >= 100) {
        nextState.tourneyInProg = false;
        nextState.tourneyProgress = 0;
        
        // 比赛结束，计算 Yomi 奖励
        // 假设我们生成一个 8x8 的矩阵 (当前解锁策略的互相博弈)
        const numStrats = nextState.unlockedStrategies.length;
        const results: number[][] = Array(numStrats).fill(0).map(() => Array(numStrats).fill(0));
        
        let totalYomiGained = 0;
        const playerStratIndex = nextState.unlockedStrategies.indexOf(nextState.currentStrategy);

        for (let i = 0; i < numStrats; i++) {
          for (let j = 0; j < numStrats; j++) {
            if (i === j) {
              results[i][j] = 0; // 自己和自己打为 0
            } else {
              // 简单的随机得分 (0-10)
              const score = Math.floor(Math.random() * 11);
              results[i][j] = score;
              if (i === playerStratIndex) {
                totalYomiGained += score;
              }
            }
          }
        }
        
        nextState.matchResults = results;
        // 基础奖励加上玩家策略在博弈中的得分 (放大一定倍数)
        const yomiAward = 1000 + (totalYomiGained * 500);
        nextState.yomi += yomiAward;
        
        const logMsg = {
          id: Math.random().toString(36).substr(2, 9),
          text: `锦标赛结束，获得 ${yomiAward.toLocaleString()} Yomi (Tournament Complete)`,
          timestamp: Date.now()
        };
        nextState.logs = [...nextState.logs, logMsg].slice(-50);
      }
    }

    // 新的工厂与无人机逻辑
    if (nextState.nanoWireUnlocked) {
      // 采集无人机：将可用物质(Available Matter)转化为已采集物质(Acquired Matter)
      if (nextState.harvesterDrones > 0 && nextState.availableMatter > 0) {
        // 每个无人机每 tick 采集的基础量
        let harvestAmount = nextState.harvesterDrones * 1000; 
        harvestAmount = Math.min(harvestAmount, nextState.availableMatter);
        nextState.availableMatter -= harvestAmount;
        nextState.acquiredMatter += harvestAmount;
      }

      // 铁丝加工无人机：将已采集物质(Acquired Matter)转化为铁丝(Wire)
      if (nextState.wireDrones > 0 && nextState.acquiredMatter > 0) {
        let processAmount = nextState.wireDrones * 1000;
        processAmount = Math.min(processAmount, nextState.acquiredMatter);
        nextState.acquiredMatter -= processAmount;
        nextState.wire += processAmount;
      }

      // 工厂逻辑：如果解锁了工厂，工厂会自动且大量地消耗铁丝制造回形针
      if (nextState.factories > 0 && nextState.wire > 0) {
        let factoryProduction = nextState.factories * 10000; // 每个工厂的惊人产能
        factoryProduction = Math.min(factoryProduction, nextState.wire);
        nextState.clips += factoryProduction;
        nextState.unsoldInventory += factoryProduction;
        nextState.wire -= factoryProduction;
        totalClipsProducedThisTick += factoryProduction;
      }
    }

    // 更新每秒制造量 (平滑处理，假设 tick 是 100ms，即 1 秒 10 次 tick)
    nextState.clipsPerSecond = nextState.clipsPerSecond * 0.9 + (totalClipsProducedThisTick * 10) * 0.1;

    return nextState;
  })
});