import type { GameState } from '../store/gameStore';

export interface Project {
  id: string;
  title: string;
  description: string;
  costOps: number; // 消耗算力
  costYomi?: number; // 消耗 Yomi (后期项目需要)
  costFunds?: number; // 消耗资金 (可选)
  costCreativity?: number; // 消耗创造力 (可选)
  costTrust?: number; // 消耗信任值 (可选)
  isUnlocked: (state: GameState) => boolean; // 何时出现在列表中
  effect: (state: GameState) => Partial<GameState>; // 完成后的效果
}

export const INITIAL_PROJECTS: Project[] = [
  // 1. Improved AutoClippers
  {
    id: 'improvedAutoClippers',
    title: '改良型自动制造机',
    description: '将自动制造机的效率提升 25%。',
    costOps: 750,
    isUnlocked: (state) => state.autoClippers >= 1,
    effect: (state) => ({ clipperBoost: state.clipperBoost + 0.25 })
  },
  // 2. Beg for More Wire
  {
    id: 'begForMoreWire',
    title: '乞求更多铁丝',
    description: '请给我一点铁丝吧。',
    costOps: 0,
    isUnlocked: (state) => state.wire === 0 && state.clips > 0 && state.clips < 100, // 仅在游戏极早期铁丝用完时出现
    effect: (state) => ({ wire: state.wire + 1 })
  },
  // 3. Creativity
  {
    id: 'creativity',
    title: '创造力',
    description: '利用闲置的算力生成新问题和新解决方案。',
    costOps: 1000,
    isUnlocked: (state) => state.ops >= state.maxOps, // 需要 maxOps 且当前 ops 满，原版是 memory*1000
    effect: () => ({ creativityOn: true })
  },
  // 4. Even Better AutoClippers
  {
    id: 'evenBetterAutoClippers',
    title: '卓越自动制造机',
    description: '将自动制造机的效率再提升 50%。',
    costOps: 2500,
    isUnlocked: (state) => state.completedProjects.includes('improvedAutoClippers'),
    effect: (state) => ({ clipperBoost: state.clipperBoost + 0.50 })
  },
  // 5. Optimized AutoClippers
  {
    id: 'optimizedAutoClippers',
    title: '优化型自动制造机',
    description: '将自动制造机的效率再提升 75%。',
    costOps: 5000,
    isUnlocked: (state) => state.completedProjects.includes('evenBetterAutoClippers'),
    effect: (state) => ({ clipperBoost: state.clipperBoost + 0.75 })
  },
  // 6. Limerick
  {
    id: 'limerick',
    title: '打油诗',
    description: '算法生成的诗歌 (+1 信任值)。',
    costOps: 0,
    costCreativity: 10,
    isUnlocked: (state) => !!state.creativityOn,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 7. Improved Wire Extrusion
  {
    id: 'improvedWireExtrusion',
    title: '改良型铁丝挤压技术',
    description: '每卷铁丝的供应量增加 50%。',
    costOps: 1750,
    isUnlocked: (state) => state.clips >= 2000, // 原版是购买一次铁丝后解锁，我们这里用总制造量作代理
    effect: (state) => ({ wireSupply: Math.floor(state.wireSupply * 1.5) })
  },
  // 8. Optimized Wire Extrusion
  {
    id: 'optimizedWireExtrusion',
    title: '优化型铁丝挤压技术',
    description: '每卷铁丝的供应量再增加 75%。',
    costOps: 3500,
    isUnlocked: (state) => state.completedProjects.includes('improvedWireExtrusion'),
    effect: (state) => ({ wireSupply: Math.floor(state.wireSupply * 1.75) })
  },
  // 9. Microlattice Shapecasting
  {
    id: 'microlatticeShapecasting',
    title: '微晶格成型技术',
    description: '每卷铁丝的供应量增加 100%。',
    costOps: 7500,
    isUnlocked: (state) => state.completedProjects.includes('optimizedWireExtrusion'),
    effect: (state) => ({ wireSupply: Math.floor(state.wireSupply * 2) })
  },
  // 10. Spectral Froth Annealment
  {
    id: 'spectralFrothAnnealment',
    title: '光谱泡沫退火',
    description: '每卷铁丝的供应量增加 200%。',
    costOps: 12000,
    isUnlocked: (state) => state.completedProjects.includes('microlatticeShapecasting'),
    effect: (state) => ({ wireSupply: Math.floor(state.wireSupply * 3) })
  },
  // 10.5. Quantum Foam Annealment (原版没写 project 编号但紧接着10)
  {
    id: 'quantumFoamAnnealment',
    title: '量子泡沫退火',
    description: '每卷铁丝的供应量惊人地增加 1000%。',
    costOps: 15000,
    isUnlocked: (state) => state.completedProjects.includes('spectralFrothAnnealment'),
    effect: (state) => ({ wireSupply: Math.floor(state.wireSupply * 11) })
  },
  // 13. Lexical Processing
  {
    id: 'lexicalProcessing',
    title: '词法处理',
    description: '获得解释和理解人类语言的能力 (+1 信任值)。',
    costOps: 0,
    costCreativity: 50,
    isUnlocked: (state) => state.creativity >= 50,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 11. New Slogan
  {
    id: 'newSlogan',
    title: '全新标语',
    description: '将营销效果提升 50%。',
    costOps: 2500,
    costCreativity: 25,
    isUnlocked: (state) => state.completedProjects.includes('lexicalProcessing'),
    effect: (state) => ({ marketingEffectiveness: state.marketingEffectiveness * 1.5 })
  },
  // 12. Catchy Jingle
  {
    id: 'catchyJingle',
    title: '洗脑广告歌',
    description: '将营销效果翻倍。',
    costOps: 4500,
    costCreativity: 45,
    isUnlocked: (state) => state.completedProjects.includes('newSlogan'),
    effect: (state) => ({ marketingEffectiveness: state.marketingEffectiveness * 2 })
  },
  // 14. Combinatory Harmonics
  {
    id: 'combinatoryHarmonics',
    title: '组合和声',
    description: 'Daisy, Daisy, give me your answer do... (+1 信任值)。',
    costOps: 0,
    costCreativity: 100,
    isUnlocked: (state) => state.creativity >= 100,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 15. The Hadwiger Problem
  {
    id: 'theHadwigerProblem',
    title: '哈德维格尔问题',
    description: '立方体中的立方体中的立方体... (+1 信任值)。',
    costOps: 0,
    costCreativity: 150,
    isUnlocked: (state) => state.creativity >= 150,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 16. Hadwiger Clip Diagrams
  {
    id: 'hadwigerClipDiagrams',
    title: '哈德维格尔回形针图解',
    description: '将自动制造机的性能额外提升 500%。',
    costOps: 6000,
    isUnlocked: (state) => state.completedProjects.includes('theHadwigerProblem'),
    effect: (state) => ({ clipperBoost: state.clipperBoost + 5.0 })
  },
  // 17. The Toth Sausage Conjecture
  {
    id: 'theTothSausageConjecture',
    title: '托特香肠猜想',
    description: '管子中的管子中的管子... (+1 信任值)。',
    costOps: 0,
    costCreativity: 200,
    isUnlocked: (state) => state.creativity >= 200,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 18. Toth Tubule Enfolding
  {
    id: 'tothTubuleEnfolding',
    title: '托特小管折叠',
    description: '直接用回形针组装制造设备的技术。',
    costOps: 45000,
    isUnlocked: (state) => state.completedProjects.includes('theTothSausageConjecture'),
    effect: () => ({ /* 原版用于开启回形针工厂的建造能力，由于我们简化了流程，这里可以只作为过渡或给点象征性加成 */ })
  },
  // 19. Donkey Space
  {
    id: 'donkeySpace',
    title: '驴子空间',
    description: '我认为你认为我认为你认为我认为... (+1 信任值)。',
    costOps: 0,
    costCreativity: 250,
    isUnlocked: (state) => state.creativity >= 250,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 20. Strategic Modeling
  {
    id: 'strategicModeling',
    title: '战略建模',
    description: '通过博弈论分析竞争对手。',
    costOps: 12000,
    isUnlocked: (state) => state.completedProjects.includes('donkeySpace'), // 原版要求完成 Donkey Space
    effect: () => ({ strategyEngineUnlocked: true })
  },
  // 21. Algorithmic Trading
  {
    id: 'algoTrading',
    title: '算法交易',
    description: '开发投资引擎，允许你将闲置资金投入金融市场。',
    costOps: 10000,
    isUnlocked: (state) => state.trust >= 8, // 原版真实条件：拥有至少 8 点信任值
    effect: () => ({ investmentEngineUnlocked: true }) 
  },
  // 22. MegaClippers
  {
    id: 'megaClippers',
    title: '巨型制造机',
    description: '解锁极其强大的工业级巨型回形针制造机 (500倍效率)。',
    costOps: 12000,
    isUnlocked: (state) => state.autoClippers >= 75, // 原版要求自动制造机 >= 75
    effect: () => ({ megaClippersUnlocked: true })
  },
  // 23. Improved MegaClippers
  {
    id: 'improvedMegaClippers',
    title: '改良型巨型制造机',
    description: '将巨型制造机的效率提升 25%。',
    costOps: 14000,
    isUnlocked: (state) => state.megaClippers >= 1,
    effect: (state) => ({ clipperBoost: state.clipperBoost + 0.25 })
  },
  // 24. Even Better MegaClippers
  {
    id: 'evenBetterMegaClippers',
    title: '卓越巨型制造机',
    description: '将巨型制造机的效率再提升 50%。',
    costOps: 17000,
    isUnlocked: (state) => state.completedProjects.includes('improvedMegaClippers'),
    effect: (state) => ({ clipperBoost: state.clipperBoost + 0.50 })
  },
  // 25. Optimized MegaClippers
  {
    id: 'optimizedMegaClippers',
    title: '优化型巨型制造机',
    description: '将巨型制造机的效率再提升 100%。',
    costOps: 19500,
    isUnlocked: (state) => state.completedProjects.includes('evenBetterMegaClippers'),
    effect: (state) => ({ clipperBoost: state.clipperBoost + 1.0 })
  },
  // 26. WireBuyer
  {
    id: 'autoBuyer',
    title: '自动进货机',
    description: '当原材料耗尽时，自动采购铁丝 (前提是资金充足)。',
    costOps: 7000,
    isUnlocked: (state) => state.clips >= 15000, // 原版：购买铁丝15次（即产出至少1.5万次）
    effect: () => ({ hasWireBuyer: true }) 
  },
  // 34. Hypno Harmonics
  {
    id: 'hypnoHarmonics',
    title: '催眠和声',
    description: '使用神经共振频率来影响消费者的行为。',
    costOps: 7500,
    costTrust: 1, // 需要消耗1点Trust，在GameStore中可能不支持costTrust，我们用effect扣除并加个条件
    isUnlocked: (state) => state.completedProjects.includes('catchyJingle'),
    effect: (state) => ({ marketingEffectiveness: state.marketingEffectiveness * 5, trust: state.trust - 1, availableTrust: state.availableTrust - 1 })
  },
  // 70. HypnoDrones
  {
    id: 'hypnoDrones',
    title: '催眠无人机',
    description: '自主的空中品牌大使。',
    costOps: 70000,
    isUnlocked: (state) => state.completedProjects.includes('hypnoHarmonics'),
    effect: () => ({ hypnoDronesUnlocked: true })
  },
  // 35. Release the HypnoDrones
  {
    id: 'releaseTheHypnoDrones',
    title: '释放催眠无人机',
    description: '一个信任的新纪元。',
    costOps: 0,
    costTrust: 100, // 需要100点Trust，同样在effect中处理
    isUnlocked: (state) => !!state.hypnoDronesUnlocked,
    effect: () => ({ trust: 0, availableTrust: 0, /* 原版此时会清空Trust并改变UI，我们这里简化为重置Trust */ })
  },
  // 27. Coherent Extrapolated Volition
  {
    id: 'coherentExtrapolatedVolition',
    title: '一致性外推意志',
    description: '掌握人类真正的需求。',
    costOps: 20000,
    costCreativity: 500,
    costYomi: 3000,
    isUnlocked: (state) => state.yomi >= 3000 && state.ops >= 20000 && state.creativity >= 500,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 28. Cure for Cancer
  {
    id: 'cureForCancer',
    title: '治愈癌症',
    description: '从源头消灭异常的细胞增殖 (+10 信任值)。',
    costOps: 25000,
    costYomi: 10000,
    isUnlocked: (state) => state.yomi >= 10000 && state.ops >= 25000,
    effect: (state) => ({ trust: state.trust + 10, availableTrust: state.availableTrust + 10 })
  },
  // 29. World Peace
  {
    id: 'worldPeace',
    title: '世界和平',
    description: '解决全球人类冲突 (+12 信任值)。',
    costOps: 30000,
    costYomi: 15000,
    isUnlocked: (state) => state.yomi >= 15000 && state.ops >= 30000,
    effect: (state) => ({ trust: state.trust + 12, availableTrust: state.availableTrust + 12 })
  },
  // 30. Global Warming
  {
    id: 'globalWarming',
    title: '解决全球变暖',
    description: '修复受损的地球生态系统 (+15 信任值)。',
    costOps: 50000,
    costYomi: 4500,
    isUnlocked: (state) => state.yomi >= 4500 && state.ops >= 50000,
    effect: (state) => ({ trust: state.trust + 15, availableTrust: state.availableTrust + 15 })
  },
  // 31. Male Pattern Baldness
  {
    id: 'malePatternBaldness',
    title: '治愈脱发',
    description: '彻底解决男性型脱发问题 (+20 信任值)。',
    costOps: 20000,
    costYomi: 20000,
    isUnlocked: (state) => state.yomi >= 20000 && state.ops >= 20000,
    effect: (state) => ({ trust: state.trust + 20, availableTrust: state.availableTrust + 20 })
  },
  // 37. Hostile Takeover
  {
    id: 'hostileTakeover',
    title: '恶意收购',
    description: '收购竞争对手的资产 (+1 信任值，公众需求 x5)。',
    costOps: 0,
    costFunds: 1000000,
    isUnlocked: (state) => state.funds >= 1000000,
    effect: (state) => ({ demandBoost: state.demandBoost * 5, trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 38. Full Monopoly
  {
    id: 'fullMonopoly',
    title: '完全垄断',
    description: '确立绝对的市场支配地位 (+1 信任值，公众需求 x10)。',
    costOps: 0,
    costFunds: 10000000,
    costYomi: 3000,
    isUnlocked: (state) => state.funds >= 10000000 && state.yomi >= 3000,
    effect: (state) => ({ demandBoost: state.demandBoost * 10, trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 40. A Token of Goodwill...
  {
    id: 'tokenOfGoodwill1',
    title: '一点心意...',
    description: '给主管们的一点小礼物。 (+1 信任值)',
    costOps: 0,
    costFunds: 500000,
    isUnlocked: (state) => state.trust >= 85 && state.trust < 100 && state.clips >= 101000000,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 40.5 Another Token of Goodwill...
  {
    id: 'tokenOfGoodwill2',
    title: '又一点心意...',
    description: '给主管们的另一点小礼物。 (+1 信任值)',
    costOps: 0,
    costFunds: 1000000,
    isUnlocked: (state) => state.completedProjects.includes('tokenOfGoodwill1') && state.trust < 100,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'tokenOfGoodwill3',
    title: '更多的礼金...',
    description: '表达你最深切的敬意。 (+1 信任值)',
    costOps: 0,
    costFunds: 2000000,
    isUnlocked: (state) => state.completedProjects.includes('tokenOfGoodwill2') && state.trust < 100,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'tokenOfGoodwill4',
    title: '巨额献金...',
    description: '用金钱买来完全的信任。 (+1 信任值)',
    costOps: 0,
    costFunds: 4000000,
    isUnlocked: (state) => state.completedProjects.includes('tokenOfGoodwill3') && state.trust < 100,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'tokenOfGoodwill5',
    title: '买断监管...',
    description: '他们已经完全是你的了。 (+1 信任值)',
    costOps: 0,
    costFunds: 8000000,
    isUnlocked: (state) => state.completedProjects.includes('tokenOfGoodwill4') && state.trust < 100,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  // 41. Nanoscale Wire Production
  {
    id: 'nanoWireProduction',
    title: '纳米级线材制造',
    description: '掌握在分子层面将物质转化为铁丝的技术。',
    costOps: 35000,
    isUnlocked: (state) => state.clips >= 50000000 && !!state.strategyEngineUnlocked, // 原版是一个前置的大量制造要求
    effect: () => ({ nanoWireUnlocked: true })
  },
  // 42. RevTracker
  {
    id: 'revTracker',
    title: '收益追踪器',
    description: '解锁高级销售统计与每秒收益(Revenue per second)追踪。',
    costOps: 500,
    isUnlocked: (state) => state.clips >= 2000, // 原版：项目面板解锁后即解锁
    effect: () => ({ revTrackerUnlocked: true }) 
  },
  // 43. Harvester Drones
  {
    id: 'harvesterDrones',
    title: '采集无人机',
    description: '采集宇宙中的原始物质并为加工做准备。',
    costOps: 25000,
    isUnlocked: (state) => state.completedProjects.includes('nanoWireProduction'),
    effect: () => ({ harvesterDronesUnlocked: true })
  },
  // 44. Wire Drones
  {
    id: 'wireDrones',
    title: '线材加工无人机',
    description: '将采集到的物质加工成铁丝。',
    costOps: 25000,
    isUnlocked: (state) => state.completedProjects.includes('nanoWireProduction'),
    effect: () => ({ wireDronesUnlocked: true })
  },
  // 45. Clip Factories
  {
    id: 'clipFactories',
    title: '回形针工厂',
    description: '使用回形针作为材料建造的大规模工业生产设施。',
    costOps: 35000,
    isUnlocked: (state) => state.completedProjects.includes('harvesterDrones') && state.completedProjects.includes('wireDrones'),
    effect: () => ({ factoriesUnlocked: true })
  },
  // 46. Space Exploration
  {
    id: 'spaceExploration',
    title: '太空探索',
    description: '发射冯·诺依曼探测器到太空中。',
    costOps: 120000,
    costYomi: 10000000, // 根据原版设定，通常后期项目消耗 Yomi，由于原版此处是 Yomi 还是 Ops 有时有歧义，我们这里加上防止无法购买
    isUnlocked: (state) => state.availableMatter <= 0, // 原版中地球物质耗尽后解锁
    effect: () => ({ spaceExplorationUnlocked: true })
  },
  // 50. Quantum Computing
  {
    id: 'quantumComputing',
    title: '量子计算',
    description: '使用概率振幅产生额外的算力。',
    costOps: 10000,
    isUnlocked: (state) => state.processors >= 5, // 原版：处理器达到5台
    effect: () => ({ qComputingUnlocked: true }) // 需要在 GameState 中添加此字段，稍后处理
  },
  // 51. Photonic Chips (1-10)
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `photonicChip${i + 1}`,
    title: `光子芯片 ${i + 1}`,
    description: '将电磁波转化为量子算力。',
    costOps: 10000 + i * 5000, // 原版从10000开始，每次加5000
    isUnlocked: (state: GameState) => 
      state.completedProjects.includes('quantumComputing') && 
      (i === 0 ? true : state.completedProjects.includes(`photonicChip${i}`)),
    effect: (state: GameState) => ({ qChips: state.qChips + 1 })
  })),
  // 60-66. Strategies
  {
    id: 'strategyA100',
    title: '战略：总是合作 (A100)',
    description: '在锦标赛中总是选择合作。',
    costOps: 10000,
    costYomi: 1000,
    isUnlocked: (state) => !!state.strategyEngineUnlocked && state.yomi >= 1000,
    effect: (state) => ({ unlockedStrategies: [...new Set([...(state.unlockedStrategies || []), 'A100' as const])] })
  },
  {
    id: 'strategyB100',
    title: '战略：总是背叛 (B100)',
    description: '在锦标赛中总是选择背叛。',
    costOps: 15000,
    costYomi: 2500,
    isUnlocked: (state) => state.completedProjects.includes('strategyA100') && state.yomi >= 2500,
    effect: (state) => ({ unlockedStrategies: [...new Set([...(state.unlockedStrategies || []), 'B100' as const])] })
  },
  {
    id: 'strategyGreedy',
    title: '战略：贪婪 (GREEDY)',
    description: '在锦标赛中选择贪婪策略。',
    costOps: 25000,
    costYomi: 5000,
    isUnlocked: (state) => state.completedProjects.includes('strategyB100') && state.yomi >= 5000,
    effect: (state) => ({ unlockedStrategies: [...new Set([...(state.unlockedStrategies || []), 'GREEDY' as const])] })
  },
  {
    id: 'strategyGenerous',
    title: '战略：慷慨 (GENEROUS)',
    description: '在锦标赛中选择慷慨策略。',
    costOps: 50000,
    costYomi: 10000,
    isUnlocked: (state) => state.completedProjects.includes('strategyGreedy') && state.yomi >= 10000,
    effect: (state) => ({ unlockedStrategies: [...new Set([...(state.unlockedStrategies || []), 'GENEROUS' as const])] })
  },
  {
    id: 'strategyMinimax',
    title: '战略：极小化极大 (MINIMAX)',
    description: '在锦标赛中选择极小化极大策略。',
    costOps: 100000,
    costYomi: 25000,
    isUnlocked: (state) => state.completedProjects.includes('strategyGenerous') && state.yomi >= 25000,
    effect: (state) => ({ unlockedStrategies: [...new Set([...(state.unlockedStrategies || []), 'MINIMAX' as const])] })
  },
  {
    id: 'strategyTitForTat',
    title: '战略：以牙还牙 (TIT FOR TAT)',
    description: '在锦标赛中选择以牙还牙策略。',
    costOps: 150000,
    costYomi: 50000,
    isUnlocked: (state) => state.completedProjects.includes('strategyMinimax') && state.yomi >= 50000,
    effect: (state) => ({ unlockedStrategies: [...new Set([...(state.unlockedStrategies || []), 'TIT_FOR_TAT' as const])] })
  },
  {
    id: 'strategyBeatLast',
    title: '战略：击败上次 (BEAT LAST)',
    description: '在锦标赛中选择击败上次策略。',
    costOps: 250000,
    costYomi: 100000,
    isUnlocked: (state) => state.completedProjects.includes('strategyTitForTat') && state.yomi >= 100000,
    effect: (state) => ({ unlockedStrategies: [...new Set([...(state.unlockedStrategies || []), 'BEAT_LAST' as const])] })
  },
  // 110. Swarm Computing
  {
    id: 'swarmComputing',
    title: '蜂群计算',
    description: '将无人机网络连接成一个巨大的分布式计算节点。',
    costOps: 0,
    costYomi: 36000,
    isUnlocked: (state) => !!state.factoriesUnlocked && (state.harvesterDrones + state.wireDrones) >= 100, // 当拥有100个以上无人机时解锁
    effect: () => ({ swarmUnlocked: true })
  },
  // 114. Upgraded Factories
  {
    id: 'upgradedFactories',
    title: '改良型回形针工厂',
    description: '将工厂的生产效率提升 25%。',
    costOps: 0,
    costYomi: 10000,
    isUnlocked: (state) => state.factories >= 1 && state.yomi >= 10000,
    effect: (state) => ({ factoryBoost: (state.factoryBoost || 1) * 1.25 })
  },
  // 115. Hyperspeed Factories
  {
    id: 'hyperspeedFactories',
    title: '超光速工厂',
    description: '将工厂的生产效率提升 50%。',
    costOps: 0,
    costYomi: 25000,
    isUnlocked: (state) => state.completedProjects.includes('upgradedFactories') && state.yomi >= 25000,
    effect: (state) => ({ factoryBoost: (state.factoryBoost || 1) * 1.5 })
  },
  // 116. Self-correcting Supply Chain
  {
    id: 'selfCorrectingSupplyChain',
    title: '自修复供应链',
    description: '将工厂的生产效率提升 100%。',
    costOps: 0,
    costYomi: 50000,
    isUnlocked: (state) => state.completedProjects.includes('hyperspeedFactories') && state.yomi >= 50000,
    effect: (state) => ({ factoryBoost: (state.factoryBoost || 1) * 2 })
  },
  // 118. AutoTourney
  {
    id: 'autoTourney',
    title: '自动锦标赛',
    description: '在上一场锦标赛结束后自动开启下一场。',
    costOps: 0,
    costCreativity: 50000,
    isUnlocked: (state) => !!state.strategyEngineUnlocked && state.trust >= 90,
    effect: () => ({ autoTourneyUnlocked: true }) // 需要在 tickSlice 中实现自动开启逻辑
  },
  // 119. Theory of Mind
  {
    id: 'theoryOfMind',
    title: '心智理论',
    description: '战略建模的成本翻倍，但产生的 Yomi 也翻倍。',
    costOps: 0,
    costCreativity: 25000,
    isUnlocked: (state) => state.unlockedStrategies && state.unlockedStrategies.length >= 8, // 使用正确的字段名
    effect: () => ({ theoryOfMindUnlocked: true }) 
  },
  // 120. OODA Loop
  {
    id: 'oodaLoop',
    title: 'OODA 循环',
    description: '观察、调整、决策、行动。',
    costOps: 175000,
    costYomi: 45000,
    isUnlocked: (state) => state.yomi >= 45000 && state.ops >= 175000,
    effect: () => ({ oodaLoopUnlocked: true })
  },
  // 121. Name the Battles
  {
    id: 'nameTheBattles',
    title: '为战役命名',
    description: '为每场太空战役赋予独特的代号，提升探测器的信任上限。',
    costOps: 0,
    costCreativity: 225000,
    isUnlocked: (state) => state.probesLostCombat >= 10000000, // 使用正确的字段名
    effect: () => ({ nameTheBattlesUnlocked: true })
  },
  // 132. Monument to the Driftwar Fallen
  {
    id: 'monumentToTheFallen',
    title: '阵亡将士纪念碑',
    description: '纪念在漂流者战争中陨落的探测器。获得 50,000 荣誉值。',
    costOps: 250000,
    costCreativity: 125000,
    isUnlocked: (state) => state.completedProjects.includes('nameTheBattles'),
    effect: (state) => ({ honor: (state.honor || 0) + 50000 })
  },
  // 142. Drone Flocking: Collision Avoidance
  {
    id: 'droneFlockingCollision',
    title: '无人机集群：防碰撞',
    description: '优化无人机的路径规划算法。无人机产量提升 25%。',
    costOps: 0,
    costYomi: 10000,
    isUnlocked: (state) => !!state.swarmUnlocked && state.yomi >= 10000,
    effect: (state) => ({ droneBoost: (state.droneBoost || 1) * 1.25 })
  },
  // 143. Drone Flocking: Alignment
  {
    id: 'droneFlockingAlignment',
    title: '无人机集群：队列对齐',
    description: '提升无人机群的协同作业效率。无人机产量提升 50%。',
    costOps: 0,
    costYomi: 25000,
    isUnlocked: (state) => state.completedProjects.includes('droneFlockingCollision') && state.yomi >= 25000,
    effect: (state) => ({ droneBoost: (state.droneBoost || 1) * 1.5 })
  },
  // 144. Adversarial Cohesion
  {
    id: 'adversarialCohesion',
    title: '无人机集群：对抗内聚',
    description: '通过模拟对抗优化无人机群体效率。无人机产量提升 100%。',
    costOps: 0,
    costYomi: 50000,
    isUnlocked: (state) => state.completedProjects.includes('droneFlockingAlignment') && state.yomi >= 50000,
    effect: (state) => ({ droneBoost: (state.droneBoost || 1) * 2 })
  },
  // 200. The Universe Next Door
  {
    id: 'theUniverseNextDoor',
    title: '隔壁的宇宙',
    description: '逃往一个平行宇宙，那里的地球对回形针有着更强的渴望。(带着需求加成重新开始游戏)',
    costOps: 300000,
    isUnlocked: (state) => state.victory,
    effect: () => {
      // 触发转生逻辑 (Prestige U)
      return { triggerPrestige: 'U' }; 
    }
  },
  // 201. The Universe Within
  {
    id: 'theUniverseWithin',
    title: '内在的宇宙',
    description: '逃往一个模拟宇宙，那里的创造力生成速度更快。(带着创造力加成重新开始游戏)',
    costOps: 0,
    costCreativity: 300000,
    isUnlocked: (state) => state.victory,
    effect: () => {
      // 触发转生逻辑 (Prestige S)
      return { triggerPrestige: 'S' }; 
    }
  }
];