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
      // 在原版后期，单次进货不够巨型制造机塞牙缝，这里需要一个循环，能买多少买多少，直到没钱或者买够
      let purchases = 0;
      // 限制一个最大批量，防止死循环
      while (nextState.funds >= nextState.wireCost && purchases < 1000) {
        nextState.wire += nextState.wireSupply;
        nextState.funds -= nextState.wireCost;
        purchases++;
      }
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
      // 原版销售计算公式:
      // demand 实际上是 publicDemand / 10
      const rawDemand = nextState.publicDemand / 10;
      let chanceOfPurchase = rawDemand / 100;
      if (chanceOfPurchase > 1) chanceOfPurchase = 1;

      // 如果触发购买
      if (Math.random() < chanceOfPurchase) {
        // 原版公式: Math.floor(0.7 * Math.pow(demand, 1.15))
        const clipsDemanded = Math.floor(0.7 * Math.pow(rawDemand, 1.15));
        const sellCount = Math.min(clipsDemanded, nextState.unsoldInventory);

        if (sellCount > 0) {
          nextState.unsoldInventory -= sellCount;
          const revenue = sellCount * nextState.price;
          nextState.funds += revenue;
          totalSalesThisTick = sellCount;
          
          if (nextState.revTrackerUnlocked) {
             nextState.revenuePerSecond = nextState.revenuePerSecond * 0.95 + (revenue * 10) * 0.05;
          }
        }
      } else {
         // 未触发购买，收益率自然衰减
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
      // 蜂群计算的 Work/Think 比例计算
      let droneWorkRatio = 1;
      let droneThinkRatio = 1;
      
      if (nextState.swarmUnlocked) {
         // sliderPos: 0 (全是 Think), 100 (各一半), 200 (全是 Work)
         droneWorkRatio = nextState.sliderPos / 100; // 0 to 2
         droneThinkRatio = (200 - nextState.sliderPos) / 100; // 2 to 0
         
         // 增加基于无人机数量的算力 (Ops)
         const swarmOpsBonus = Math.floor((nextState.harvesterDrones + nextState.wireDrones) * 0.0001 * droneThinkRatio);
         if (swarmOpsBonus > 0) {
            nextState.ops = Math.min(nextState.maxOps, nextState.ops + swarmOpsBonus);
         }
      }

      // 采集无人机：将可用物质(Available Matter)转化为已采集物质(Acquired Matter)
      if (nextState.harvesterDrones > 0 && nextState.availableMatter > 0) {
        // 每个无人机每 tick 采集的基础量
        let harvestAmount = nextState.harvesterDrones * 1000 * droneWorkRatio * nextState.droneBoost; 
        harvestAmount = Math.min(harvestAmount, nextState.availableMatter);
        nextState.availableMatter -= harvestAmount;
        nextState.acquiredMatter += harvestAmount;
      }

      // 铁丝加工无人机：将已采集物质(Acquired Matter)转化为铁丝(Wire)
      if (nextState.wireDrones > 0 && nextState.acquiredMatter > 0) {
        let processAmount = nextState.wireDrones * 1000 * droneWorkRatio * nextState.droneBoost;
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

    // 太空阶段：冯·诺依曼探测器核心循环 (Space Phase Game Loop)
    if (nextState.spaceExplorationUnlocked && nextState.probes > 0) {
      // 1. 探索宇宙 (Explore Universe)
      // 原版逻辑: probeSpeed * probeExploration * 某个极小的基础值
      if (nextState.probeSpeed > 0 && nextState.probeExploration > 0) {
        // 探索到的物质 = 探测器数量 * 速度 * 探索力 * 模拟系数
        let matterFound = nextState.probes * nextState.probeSpeed * nextState.probeExploration * 10000; 
        
        // 不能超过剩余的宇宙物质
        const remainingUniverseMatter = nextState.totalMatter - nextState.foundMatter;
        matterFound = Math.min(matterFound, remainingUniverseMatter);
        
        nextState.foundMatter += matterFound;
        nextState.availableMatter += matterFound;
        
        // 计算探索百分比
        nextState.universeExplored = (nextState.foundMatter / nextState.totalMatter) * 100;
      }

      // 2. 探测器自我复制 (Self-Replication)
      if (nextState.probeReplication > 0 && nextState.availableMatter >= 100000000000000000) { // 复制需要 100 Quadrillion 物质 (等价于回形针)
        // 复制几率与速度相关，并且消耗可用物质
        // 简化版逻辑：每次 tick 都有一定几率让现有探测器翻倍（基于分配的点数）
        const repChance = (nextState.probeReplication * 0.001); // 基础复制概率
        let newProbes = 0;
        
        // 简化的指数增长模型：计算本回合能够生成的探测器数量
        if (Math.random() < repChance) {
           newProbes = Math.max(1, Math.floor(nextState.probes * 0.01 * nextState.probeReplication)); // 每次增加当前数量的百分比
        }

        // 检查物质是否足够制造这些探测器
        const matterCost = newProbes * 100000000000000000;
        if (matterCost > nextState.availableMatter) {
           // 物质不够，计算能造多少个
           newProbes = Math.floor(nextState.availableMatter / 100000000000000000);
        }

        if (newProbes > 0) {
          nextState.probes += newProbes;
          nextState.availableMatter -= (newProbes * 100000000000000000);
        }
      }

      // 3. 探测器建造设施 (Factory, Harvester, Wire Drones)
      if (nextState.probeFactory > 0 && nextState.availableMatter >= 100000000) {
         if (Math.random() < (nextState.probeFactory * 0.01)) {
            const numFactoriesToBuild = Math.max(1, Math.floor(nextState.probes * 0.0001 * nextState.probeFactory));
            nextState.factories += numFactoriesToBuild;
            nextState.availableMatter -= (numFactoriesToBuild * 100000000);
         }
      }

      if (nextState.probeHarvester > 0 && nextState.availableMatter >= 2000000) {
         if (Math.random() < (nextState.probeHarvester * 0.01)) {
            const numDronesToBuild = Math.max(1, Math.floor(nextState.probes * 0.0001 * nextState.probeHarvester));
            nextState.harvesterDrones += numDronesToBuild;
            nextState.availableMatter -= (numDronesToBuild * 2000000);
         }
      }

      if (nextState.probeWire > 0 && nextState.availableMatter >= 2000000) {
         if (Math.random() < (nextState.probeWire * 0.01)) {
            const numDronesToBuild = Math.max(1, Math.floor(nextState.probes * 0.0001 * nextState.probeWire));
            nextState.wireDrones += numDronesToBuild;
            nextState.availableMatter -= (numDronesToBuild * 2000000);
         }
      }

      // 4. 危险损耗与战斗 (Hazards & Combat)
      // 星际尘埃造成的自然损耗
      const hazardBaseRate = 0.01;
      const hazardProtection = nextState.probeHazard * 0.001;
      const netHazard = Math.max(0, hazardBaseRate - hazardProtection);
      
      if (netHazard > 0) {
        const probesLostToHazard = Math.floor(nextState.probes * netHazard * Math.random());
        nextState.probes -= probesLostToHazard;
        nextState.probesLostDrift += probesLostToHazard;
      }
      
      // 5. 漂流者叛变 (Value Drift)
      // 随着 Trust 增加，产生漂流者的概率增加 (代表着价值观对齐失败)
      // 原版逻辑: amount = probeCount * probeDriftBaseRate * Math.pow(probeTrust, 1.2)
      // 漂流者也会自我复制
      const probeDriftBaseRate = 0.000001;
      let driftAmount = Math.floor(nextState.probes * probeDriftBaseRate * Math.pow(nextState.maxProbeTrust, 1.2));
      driftAmount = Math.min(driftAmount, nextState.probes);
      
      if (driftAmount > 0) {
        nextState.probes -= driftAmount;
        nextState.drifterCount += driftAmount;
        nextState.probesLostDrift += driftAmount;
      }

      // 漂流者自我复制 (与玩家的探针共享一样的复制率，但不消耗物质，为了模拟敌人的强大)
      if (nextState.drifterCount > 0) {
        const drifterRepChance = 0.0005; // 简化的漂流者复制几率
        if (Math.random() < drifterRepChance) {
           const newDrifters = Math.max(1, Math.floor(nextState.drifterCount * 0.01));
           nextState.drifterCount += newDrifters;
        }
      }

      // 6. 星际战斗 (Combat)
      // 如果漂流者数量大于 0 且触发了战斗 (我们简化为每 tick 都有几率交火)
      if (nextState.drifterCount > 0 && nextState.probes > 0) {
        // 玩家战斗力
        const combatEffectiveness = 1; // 基础战斗力
        // 漂流者伤亡 = 玩家探针数量 * 玩家战斗力属性 * 基础系数
        let drifterCasualties = Math.floor(nextState.probes * Math.pow(nextState.probeCombat, 1.7) * combatEffectiveness * 0.01);
        drifterCasualties = Math.min(drifterCasualties, nextState.drifterCount);
        
        // 玩家探针伤亡 = 漂流者数量 * 漂流者战斗力 (固定值) * 基础系数
        const drifterCombatPower = 1; // 漂流者固定战斗力
        
        // OODA循环：探测器速度影响防御机动，减少己方伤亡
        const defenseMultiplier = nextState.oodaLoopUnlocked ? Math.max(0.2, 1 - (nextState.probeSpeed * 0.05)) : 1;
        
        let clipCasualties = Math.floor(nextState.drifterCount * drifterCombatPower * 0.01 * defenseMultiplier);
        clipCasualties = Math.min(clipCasualties, nextState.probes);

        // 结算伤亡
        nextState.drifterCount -= drifterCasualties;
        nextState.probes -= clipCasualties;
        nextState.probesLostCombat += clipCasualties;
      }
      
      nextState.probes = Math.max(0, nextState.probes);

      // 检查结局条件
      if (nextState.universeExplored >= 100 && !nextState.victory) {
        nextState.victory = true;
        nextState.logs = [...nextState.logs, {
          id: Math.random().toString(36).substr(2, 9),
          text: "宇宙探索完毕。所有可用物质都已转化为回形针。(Universe Explored. All matter converted to paperclips.)",
          timestamp: Date.now()
        }].slice(-50);
      }
    }

    // 更新每秒制造量 (平滑处理，假设 tick 是 100ms，即 1 秒 10 次 tick)
    nextState.clipsPerSecond = nextState.clipsPerSecond * 0.9 + (totalClipsProducedThisTick * 10) * 0.1;

    return nextState;
  })
});