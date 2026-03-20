import type { GameState } from '../store/gameStore';

export interface Project {
  id: string;
  title: string;
  description: string;
  costOps: number; // 消耗算力
  costFunds?: number; // 消耗资金 (可选)
  costCreativity?: number; // 消耗创造力 (可选)
  isUnlocked: (state: GameState) => boolean; // 何时出现在列表中
  effect: (state: GameState) => Partial<GameState>; // 完成后的效果
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'improvedAutoClippers',
    title: '改良型自动制造机 (Improved AutoClippers)',
    description: '将自动制造机的效率提升 25%。',
    costOps: 750,
    isUnlocked: (state) => state.autoClippers >= 1,
    effect: (state) => ({ clipperBoost: state.clipperBoost + 0.25 })
  },
  {
    id: 'evenBetterAutoClippers',
    title: '更佳的自动制造机 (Even Better AutoClippers)',
    description: '将自动制造机的效率再提升 50%。',
    costOps: 2500,
    isUnlocked: (state) => state.completedProjects.includes('improvedAutoClippers'),
    effect: (state) => ({ clipperBoost: state.clipperBoost + 0.50 })
  },
  {
    id: 'creativity',
    title: '创造力 (Creativity)',
    description: '利用闲置的算力生成新问题和新解决方案。',
    costOps: 1000,
    isUnlocked: (state) => state.ops >= state.maxOps, // 需要 maxOps 且当前 ops 满，原版是 memory*1000
    effect: () => ({ creativityOn: true })
  },
  {
    id: 'limerick',
    title: '打油诗 (Limerick)',
    description: '算法生成的诗歌 (+1 信任值)。',
    costOps: 0,
    costCreativity: 10,
    isUnlocked: (state) => !!state.creativityOn,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'lexicalProcessing',
    title: '词法处理 (Lexical Processing)',
    description: '获得解释和理解人类语言的能力 (+1 信任值)。',
    costOps: 0,
    costCreativity: 50,
    isUnlocked: (state) => state.creativity >= 50,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'combinatoryHarmonics',
    title: '组合和声 (Combinatory Harmonics)',
    description: 'Daisy, Daisy, give me your answer do... (+1 信任值)。',
    costOps: 0,
    costCreativity: 100,
    isUnlocked: (state) => state.creativity >= 100,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'theHadwigerProblem',
    title: '哈德维格尔问题 (The Hadwiger Problem)',
    description: '立方体中的立方体中的立方体... (+1 信任值)。',
    costOps: 0,
    costCreativity: 150,
    isUnlocked: (state) => state.creativity >= 150,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'theTothSausageConjecture',
    title: '托特香肠猜想 (The Tóth Sausage Conjecture)',
    description: '管子中的管子中的管子... (+1 信任值)。',
    costOps: 0,
    costCreativity: 200,
    isUnlocked: (state) => state.creativity >= 200,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'donkeySpace',
    title: '驴子空间 (Donkey Space)',
    description: '我认为你认为我认为你认为我认为... (+1 信任值)。',
    costOps: 0,
    costCreativity: 250,
    isUnlocked: (state) => state.creativity >= 250,
    effect: (state) => ({ trust: state.trust + 1, availableTrust: state.availableTrust + 1 })
  },
  {
    id: 'improvedWireExtrusion',
    title: '改良型铁丝挤压技术 (Improved Wire Extrusion)',
    description: '每卷铁丝的供应量增加 50%。',
    costOps: 1750,
    isUnlocked: (state) => state.clips >= 2000, // 原版是购买一次铁丝后解锁，我们这里用总制造量作代理
    effect: (state) => ({ wireSupply: Math.floor(state.wireSupply * 1.5) })
  },
  {
    id: 'optimizedWireExtrusion',
    title: '优化型铁丝挤压技术 (Optimized Wire Extrusion)',
    description: '每卷铁丝的供应量再增加 75%。',
    costOps: 3500,
    isUnlocked: (state) => state.completedProjects.includes('improvedWireExtrusion'),
    effect: (state) => ({ wireSupply: Math.floor(state.wireSupply * 1.75) })
  },
  {
    id: 'strategicModeling',
    title: '战略建模 (Strategic Modeling)',
    description: '通过博弈论分析竞争对手。',
    costOps: 12000,
    isUnlocked: (state) => state.completedProjects.includes('donkeySpace'), // 原版要求完成 Donkey Space
    effect: () => ({ strategyEngineUnlocked: true })
  },
  {
    id: 'revTracker',
    title: '收益追踪器 (RevTracker)',
    description: '解锁高级销售统计与每秒收益(Revenue per second)追踪。',
    costOps: 500,
    isUnlocked: (state) => state.clips >= 2000, // 原版：项目面板解锁后即解锁
    effect: () => ({ revTrackerUnlocked: true }) 
  },
  {
    id: 'quantumComputing',
    title: '量子计算 (Quantum Computing)',
    description: '使用概率振幅产生额外的算力。',
    costOps: 10000,
    isUnlocked: (state) => state.processors >= 5, // 原版：处理器达到5台
    effect: () => ({ qComputingUnlocked: true }) // 需要在 GameState 中添加此字段，稍后处理
  },
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `photonicChip${i + 1}`,
    title: `光子芯片 ${i + 1} (Photonic Chip)`,
    description: '将电磁波转化为量子算力。',
    costOps: 10000 + i * 5000, // 原版从10000开始，每次加5000
    isUnlocked: (state: GameState) => 
      state.completedProjects.includes('quantumComputing') && 
      (i === 0 ? true : state.completedProjects.includes(`photonicChip${i}`)),
    effect: (state: GameState) => ({ qChips: state.qChips + 1 })
  })),
  {
    id: 'autoBuyer',
    title: '自动进货机 (WireBuyer)',
    description: '当铁丝耗尽时，自动购买铁丝 (前提是资金充足)。',
    costOps: 7000,
    isUnlocked: (state) => state.clips >= 15000, // 原版：购买铁丝15次（即产出至少1.5万次）
    effect: () => ({ hasWireBuyer: true }) 
  },
  {
    id: 'algoTrading',
    title: '算法交易 (Algorithmic Trading)',
    description: '开发投资引擎，允许你将闲置资金投入股市。',
    costOps: 10000,
    isUnlocked: (state) => state.trust >= 8, // 原版真实条件：拥有至少 8 点信任值
    effect: () => ({ investmentEngineUnlocked: true }) 
  },
  {
    id: 'megaClippers',
    title: '巨型制造机 (MegaClippers)',
    description: '解锁极其强大的工业级巨型回形针制造机 (500倍效率)。',
    costOps: 12000,
    isUnlocked: (state) => state.autoClippers >= 75, // 原版要求自动制造机 >= 75
    effect: () => ({ megaClippersUnlocked: true })
  },
  {
    id: 'nanoWireProduction',
    title: '纳米级铁丝制造 (Nanoscale Wire Production)',
    description: '掌握在分子层面将物质转化为铁丝的技术。',
    costOps: 35000,
    isUnlocked: (state) => state.clips >= 50000000 && state.strategyEngineUnlocked, // 原版是一个前置的大量制造要求
    effect: () => ({ nanoWireUnlocked: true })
  },
  {
    id: 'harvesterDrones',
    title: '采集无人机 (Harvester Drones)',
    description: '采集宇宙中的原始物质(Matter)并为加工做准备。',
    costOps: 25000,
    isUnlocked: (state) => state.completedProjects.includes('nanoWireProduction'),
    effect: () => ({ harvesterDronesUnlocked: true })
  },
  {
    id: 'wireDrones',
    title: '铁丝加工无人机 (Wire Drones)',
    description: '将采集到的物质(Matter)加工成铁丝(Wire)。',
    costOps: 25000,
    isUnlocked: (state) => state.completedProjects.includes('nanoWireProduction'),
    effect: () => ({ wireDronesUnlocked: true })
  },
  {
    id: 'clipFactories',
    title: '回形针工厂 (Clip Factories)',
    description: '使用回形针作为材料建造的大规模工业生产设施。',
    costOps: 35000,
    isUnlocked: (state) => state.completedProjects.includes('harvesterDrones') && state.completedProjects.includes('wireDrones'),
    effect: () => ({ factoriesUnlocked: true })
  },
  {
    id: 'spaceExploration',
    title: '太空探索 (Space Exploration)',
    description: '发射冯·诺依曼探测器到太空中。',
    costOps: 120000,
    isUnlocked: (state) => state.availableMatter <= 0, // 原版中地球物质耗尽后解锁
    effect: () => ({ spaceExplorationUnlocked: true })
  },
  {
    id: 'swarmComputing',
    title: '蜂群计算 (Swarm Computing)',
    description: '将无人机网络连接成一个巨大的分布式计算节点。',
    costOps: 50000,
    isUnlocked: (state) => !!state.factoriesUnlocked && (state.harvesterDrones + state.wireDrones) >= 100, // 当拥有100个以上无人机时解锁
    effect: () => ({ swarmUnlocked: true })
  }
];
