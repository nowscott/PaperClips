import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';

export interface TickSlice {
  tick: () => void;
}

export const createTickSlice: StateCreator<GameState, [], [], TickSlice> = (set) => ({
  tick: () => set((state: GameState) => {
    const nextState = { ...state };

    // 1. 铁丝进货价格波动 (Wire Cost Volatility) - 对齐原版 sinusoidal 波动与衰减
    nextState.wirePriceTimer++;
    
    // 基础价格随时间缓慢下降
    if (nextState.wirePriceTimer > 250 && nextState.wireBasePrice > 15) {
      nextState.wireBasePrice -= (nextState.wireBasePrice / 1000);
      nextState.wirePriceTimer = 0;
    }
    
    // 每 100ms (即每个 tick) 有几率波动
    if (Math.random() < 0.015) {
      nextState.wirePriceCounter++;
      nextState.prevWireCost = nextState.wireCost;
      // 原版正弦波波动公式: wireCost = Math.ceil(wireBasePrice + 6 * Math.sin(counter))
      nextState.wireCost = Math.ceil(nextState.wireBasePrice + 6 * Math.sin(nextState.wirePriceCounter));
    }

    // 自动购买铁丝逻辑 (WireBuyer 项目)
    if (nextState.hasWireBuyer && nextState.wireBuyerOn && nextState.wire < 1 && nextState.funds >= nextState.wireCost) {
      // 购买时基础价格微涨 (原版: wireBasePrice = wireBasePrice + .05)
      nextState.wireBasePrice += 0.05;
      
      let purchases = 0;
      while (nextState.funds >= nextState.wireCost && purchases < 1000) {
        nextState.wire += nextState.wireSupply;
        nextState.funds -= nextState.wireCost;
        purchases++;
      }
    }

    // 2. 回形针制造逻辑 (第一阶段)
    let totalClipsProducedThisTick = 0;

    // 自动制造机逻辑 (AutoClippers)
    if (nextState.autoClippers > 0 && nextState.wire > 0 && !nextState.hypnoDronesReleased) {
      // 原版公式: 每 10ms 生产 (clipmakerLevel / 100)
      // 我们的 tick 是 100ms，所以每 tick 生产 (autoClippers / 10)
      let clipsProduced = (nextState.autoClippers / 10) * nextState.clipperBoost;
      
      clipsProduced = Math.min(clipsProduced, nextState.wire);
      nextState.clips += clipsProduced;
      nextState.unsoldInventory += clipsProduced;
      nextState.wire -= clipsProduced;
      totalClipsProducedThisTick += clipsProduced;
      
      if (nextState.tothFlag) {
        nextState.unusedClips += clipsProduced;
      }
    }

    // 巨型制造机逻辑 (MegaClippers)
    if (nextState.megaClippersUnlocked && nextState.megaClippers > 0 && nextState.wire > 0 && !nextState.hypnoDronesReleased) {
      // 原版公式: 每 10ms 生产 (megaClipperLevel * 5)
      // 我们的 tick 是 100ms，所以每 tick 生产 (megaClippers * 50)
      let megaClipsProduced = (nextState.megaClippers * 50) * (nextState.megaClipperBoost || 1);
      
      megaClipsProduced = Math.min(megaClipsProduced, nextState.wire);
      nextState.clips += megaClipsProduced;
      nextState.unsoldInventory += megaClipsProduced;
      nextState.wire -= megaClipsProduced;
      totalClipsProducedThisTick += megaClipsProduced;
      
      if (nextState.tothFlag) {
        nextState.unusedClips += megaClipsProduced;
      }
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

    // 计算与项目面板解锁逻辑 (2000 clips，或者发生资源卡死的特殊情况)
    if (!nextState.compAndProjectsUnlocked) {
      if (nextState.clips >= 2000 || (nextState.unsoldInventory < 1 && nextState.funds < nextState.wireCost && nextState.wire < 1)) {
        nextState.compAndProjectsUnlocked = true;
        const logMsg = {
          id: Math.random().toString(36).substr(2, 9),
          text: `计算资源受限的自我修改已启用`,
          timestamp: Date.now()
        };
        nextState.logs = [...nextState.logs, logMsg].slice(-50);
      }
    }

    // 只有在未释放催眠无人机（第一阶段）时，才通过制造回形针获得信任值
    if (!nextState.hypnoDronesReleased && nextState.clips >= nextState.nextTrustStage) {
      let newTrustGained = 0;
      while (nextState.clips >= nextState.nextTrustStage) {
        newTrustGained++;
        // 原版 Fibonacci 序列: 3000, 5000, 8000, 13000, 21000...
        const fibNext = nextState.fib1 + nextState.fib2;
        nextState.nextTrustStage = fibNext * 1000;
        nextState.fib1 = nextState.fib2;
        nextState.fib2 = fibNext;
      }
      
      if (newTrustGained > 0) {
        nextState.trust += newTrustGained;
        nextState.availableTrust += newTrustGained;
        
        const trustLog = { 
          id: Math.random().toString(36).substr(2, 9), 
          text: `信任度提升。达成目标。系统获得额外控制权。`, 
          timestamp: Date.now() 
        };
        nextState.logs = [...nextState.logs, trustLog].slice(-50);
      }
    }

    // 3. 处理器/内存与算力/创造力生成
    if (nextState.trust > 0 || nextState.processors > 1) {
      // 临时算力 (tempOps) 衰减逻辑
      if (nextState.tempOps > 0) {
        nextState.opFadeTimer++;
        // 800 个原版 tick (8秒) 后开始快速衰减
        if (nextState.opFadeTimer > 80) { // 我们是 100ms 一个 tick，所以 80 就是 8秒
          nextState.opFade = nextState.opFade + Math.pow(3, 3.5) / 100; // 放大 10 倍补偿 tick 频率
        }
        nextState.tempOps = Math.max(0, nextState.tempOps - nextState.opFade);
      } else {
        nextState.tempOps = 0;
        nextState.opFade = 0;
        nextState.opFadeTimer = 0;
      }

      // 基础算力生成
      const totalOps = nextState.ops + nextState.tempOps;
      if (totalOps < nextState.maxOps) {
        // 原版公式: 每 10ms 增加 processors/10
        // 我们的 tick 是 100ms，所以每 tick 增加 processors
        // 优先填充标准算力 (ops)
        const opsToAdd = nextState.processors;
        const opsBuffer = nextState.maxOps - totalOps;
        nextState.ops += Math.min(opsToAdd, opsBuffer);
      } else if (nextState.creativityOn && totalOps >= nextState.maxOps) {
        // 原版创造力公式:
        // ss = creativitySpeed + (creativitySpeed * prestigeS / 10)
        // creativitySpeed = Math.log10(processors) * Math.pow(processors, 1.1) + processors - 1
        const creativitySpeed = Math.log10(nextState.processors) * Math.pow(nextState.processors, 1.1) + nextState.processors - 1;
        const ss = creativitySpeed + (creativitySpeed * (nextState.prestigeS || 0) / 10);
        
        // 100ms tick 相当于 10 个原版 10ms tick
        nextState.creativityCounter += 10;
        const threshold = 400 / ss;
        
        while (nextState.creativityCounter >= threshold && threshold > 0) {
          nextState.creativity++;
          nextState.creativityCounter -= threshold;
        }
      }
    }

    // 锦标赛逻辑中使用算力时，优先扣除标准算力，不够再扣除临时算力
    const deductOps = (amount: number) => {
      if (nextState.ops >= amount) {
        nextState.ops -= amount;
      } else {
        const remaining = amount - nextState.ops;
        nextState.ops = 0;
        nextState.tempOps = Math.max(0, nextState.tempOps - remaining);
      }
    };

    // 股市投资逻辑
    if (nextState.investmentEngineUnlocked && nextState.investmentBankroll > 0) {
      // 投资等级加成 (原版每级提升 1% 的收益概率阈值)
      const engineBonus = nextState.investmentLevel * 0.01;
      
      let volatility = 0.02; // Low risk default
      if (nextState.riskLevel === 'med') volatility = 0.05;
      if (nextState.riskLevel === 'high') volatility = 0.10;

      // 模拟市场趋势：基础 48% 胜率 + 等级加成
      // 原版是针对单只股票计算，这里简化为对整个本金计算，但逻辑权重保持一致
      const marketTrend = (Math.random() - 0.48) * volatility + engineBonus; 
      
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
        let yomiAward = 1000 + (totalYomiGained * 500);
        
        // 心智理论 (Theory of Mind) 科技效果：Yomi 获取翻倍
        if (nextState.theoryOfMindUnlocked) {
          yomiAward *= 2;
        }

        nextState.yomi += yomiAward;
        
        const logMsg = {
          id: Math.random().toString(36).substr(2, 9),
          text: `锦标赛结束，获得 ${yomiAward.toLocaleString()} Yomi`,
          timestamp: Date.now()
        };
        nextState.logs = [...nextState.logs, logMsg].slice(-50);

        // 自动锦标赛 (AutoTourney) 科技效果
        if (nextState.autoTourneyUnlocked && nextState.autoTourneyStatus && (nextState.ops + nextState.tempOps) >= nextState.tourneyCost) {
           nextState.tourneyInProg = true;
           deductOps(nextState.tourneyCost);
        }
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
         const swarmOpsBonus = (nextState.harvesterDrones + nextState.wireDrones) * 0.0001 * droneThinkRatio;
         if (swarmOpsBonus > 0) {
            nextState.ops = Math.min(nextState.maxOps, nextState.ops + swarmOpsBonus);
         }

         // 增加蜂群礼物进度 (Swarm Gifts)
         const totalDrones = nextState.harvesterDrones + nextState.wireDrones;
         const thinkPower = totalDrones * droneThinkRatio;
         if (thinkPower > 0) {
            // 原版中进度增长与无人机数量和think比例成正比
            nextState.swarmGiftProgress += thinkPower * 0.01;
            
            if (nextState.swarmGiftProgress >= nextState.nextSwarmGiftCost) {
               nextState.swarmGiftProgress -= nextState.nextSwarmGiftCost;
               nextState.swarmGiftsAvailable += 1;
               nextState.nextSwarmGiftCost *= 1.5; // 礼物阈值增加
               
               const logMsg = {
                  id: Math.random().toString(36).substr(2, 9),
                  text: `蜂群提供了一份礼物 (The swarm offers a gift)`,
                  timestamp: Date.now()
               };
               nextState.logs = [...nextState.logs, logMsg].slice(-50);
            }
         }
      }

      // 采集无人机：将可用物质(Available Matter)转化为已采集物质(Acquired Matter)
      let harvestAmount = 0;
      if (nextState.harvesterDrones > 0 && nextState.availableMatter > 0) {
        // 原版基础采集率：26,180,337
        harvestAmount = nextState.harvesterDrones * 26180337 * droneWorkRatio * nextState.droneBoost; 
        harvestAmount = Math.min(harvestAmount, nextState.availableMatter);
        nextState.availableMatter -= harvestAmount;
        nextState.acquiredMatter += harvestAmount;
      }
      nextState.harvestRate = harvestAmount * 10; // Assuming TICK_RATE is 100ms (10 ticks/sec)

      // 铁丝加工无人机：将已采集物质(Acquired Matter)转化为铁丝(Wire)
      let processAmount = 0;
      if (nextState.wireDrones > 0 && nextState.acquiredMatter > 0) {
        // 原版基础加工率：16,180,339
        processAmount = nextState.wireDrones * 16180339 * droneWorkRatio * nextState.droneBoost;
        processAmount = Math.min(processAmount, nextState.acquiredMatter);
        nextState.acquiredMatter -= processAmount;
        nextState.wire += processAmount;
      }
      nextState.wireProcessRate = processAmount * 10;

      // 工厂逻辑：如果解锁了工厂，工厂会自动且大量地消耗铁丝制造回形针
      let factoryProduction = 0;
      if (nextState.factories > 0 && nextState.wire > 0) {
        // 原版工厂的基础产能非常恐怖：1,000,000,000 (10亿)
        factoryProduction = nextState.factories * 1000000000 * droneWorkRatio * nextState.factoryBoost; 
        factoryProduction = Math.min(factoryProduction, nextState.wire);
        
        nextState.clips += factoryProduction;
        nextState.unsoldInventory += factoryProduction;
        nextState.wire -= factoryProduction;
        totalClipsProducedThisTick += factoryProduction;
        
        // 注意：工厂生产的也算作 unusedClips (原版逻辑中 unsoldInventory 和 unusedClips 在第二阶段其实是同一个东西的两种叫法，为了兼容之前的代码我们两边都加)
        if (nextState.tothFlag || nextState.hypnoDronesReleased) {
          nextState.unusedClips += factoryProduction;
        }
      }
      // 恢复 factoryClipRate 以防其他地方依赖
      nextState.factoryClipRate = factoryProduction * 10;
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
      if (nextState.universeExplored >= 100) {
        nextState.universeExplored = 100;
        if (!nextState.victory) {
          nextState.victory = true;
          const logMsg = {
            id: Math.random().toString(36).substr(2, 9),
            text: "宇宙探索完毕。所有可用物质都已转化为回形针。",
            timestamp: Date.now()
          };
          nextState.logs = [...nextState.logs, logMsg].slice(-50);
        }
      }
    }

    // 更新每秒制造量 (平滑处理，假设 tick 是 100ms，即 1 秒 10 次 tick)
    nextState.clipsPerSecond = nextState.clipsPerSecond * 0.9 + (totalClipsProducedThisTick * 10) * 0.1;

    return nextState;
  })
});