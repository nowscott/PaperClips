import { Header } from './components/Header';
import { Manufacturing } from './components/Manufacturing';
import { Business } from './components/Business';
import { QuantumComputing } from './components/QuantumComputing';
import { Computing } from './components/Computing';
import { Projects } from './components/Projects';
import { Investments } from './components/Investments';
import { StrategicModeling } from './components/StrategicModeling';
import { SpaceAndDrones } from './components/SpaceAndDrones';
import { SpaceExploration } from './components/SpaceExploration';
import { ConsoleLog } from './components/ConsoleLog';
import { GameLoop } from './components/GameLoop';
import { TabbedPanelGroup } from './components/TabbedPanelGroup';
import { useGameStore } from './store/gameStore';

function App() {
  const { 
    spaceExplorationUnlocked,
    investmentEngineUnlocked,
    strategyEngineUnlocked,
    compAndProjectsUnlocked,
    qComputingUnlocked,
    nanoWireUnlocked,
    harvesterDronesUnlocked,
    wireDronesUnlocked,
    factoriesUnlocked,
    hypnoDronesReleased
  } = useGameStore();

  return (
    <div className="container mx-auto max-w-7xl p-2 sm:p-4 md:p-8">
      <GameLoop />
      {/* 顶部状态栏 */}
      <Header />

      {/* 终端日志区 (横跨全宽) */}
      <div className="mb-4 sm:mb-6">
        <ConsoleLog />
      </div>

      {/* 主体布局：根据是否进入太空阶段动态调整列数 */}
      <div className={`grid grid-cols-1 ${spaceExplorationUnlocked ? 'lg:grid-cols-4 md:grid-cols-2' : 'lg:grid-cols-3 md:grid-cols-2'} gap-4 sm:gap-6 items-start`}>
        
        {/* 左侧/第一列：制造与无人机 */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <TabbedPanelGroup
            tabs={[
              { 
                id: 'manufacturing', 
                label: "制造",
                icon: 'Hammer',
                content: <Manufacturing /> 
              },
              { 
                id: 'space_and_drones', 
                label: "资源",
                icon: 'Rocket',
                content: <SpaceAndDrones />,
                // 当至少有一个无人机相关科技解锁时才显示此 Tab
                // 注意：不能用 availableMatter > 0，因为游戏初始时地球物质就是满的，会导致一开局就暴露此面板
                condition: nanoWireUnlocked ||
                           harvesterDronesUnlocked || 
                           wireDronesUnlocked || 
                           factoriesUnlocked
              }
            ]}
          />
        </div>

        {/* 中间/第二列：商业与投资 (Tabbed) */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <TabbedPanelGroup
            tabs={[
              { 
                id: 'business', 
                label: "商业",
                icon: 'Briefcase',
                content: <Business />,
                condition: !hypnoDronesReleased
              },
              { 
                id: 'investments', 
                label: "投资",
                icon: 'LineChart',
                content: <Investments />, 
                condition: investmentEngineUnlocked && !hypnoDronesReleased
              },
              { 
                id: 'strategic_modeling', 
                label: "战略",
                icon: 'BrainCircuit',
                content: <StrategicModeling />, 
                condition: strategyEngineUnlocked 
              }
            ]}
          />
        </div>

        {/* 右侧/第三列：计算与项目 (Tabbed) */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {compAndProjectsUnlocked ? (
            <TabbedPanelGroup
              tabs={[
                { 
                  id: 'computing', 
                  label: "计算",
                  icon: 'Terminal',
                  content: <Computing /> 
                },
                { 
                  id: 'quantum_computing', 
                  label: "量子",
                  icon: 'Cpu',
                  content: <QuantumComputing />, 
                  condition: qComputingUnlocked 
                },
                { 
                  id: 'projects', 
                  label: "项目",
                  icon: 'FlaskConical',
                  content: <Projects /> 
                }
              ]}
            />
          ) : (
            <Computing /> // 未解锁前作为占位或显示系统离线
          )}
        </div>

        {/* 第四列：仅在太空阶段显示 (如果不显示，前面的三列会均匀铺满) */}
        {spaceExplorationUnlocked && (
          <div className="flex flex-col gap-4 sm:gap-6">
            <SpaceExploration />
          </div>
        )}
      </div>
      
      {/* 底部开源声明 */}
      <footer className="mt-12 mb-4 flex flex-col items-center justify-center gap-1 text-xs text-evolve-textDim tracking-wider opacity-50">
        <div className="flex items-center gap-1">
          无限回形针 (开源重制版) <span className="font-mono ml-1">v{__APP_VERSION__}</span> · 原作: 
          <a 
            href="https://www.decisionproblem.com/paperclips/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-evolve-accent hover:underline transition-colors"
          >
            Decision Problem
          </a>
        </div>
        <div className="flex items-center gap-1">
          由 nowscott 重制 · 
          <a 
            href="https://github.com/nowscott/PaperClips" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-evolve-accent hover:underline transition-colors"
          >
            GitHub 开源地址
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
