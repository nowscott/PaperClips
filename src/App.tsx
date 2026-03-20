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
    qComputingUnlocked
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
          <Manufacturing />
          <SpaceAndDrones />
        </div>

        {/* 中间/第二列：商业与投资 (Tabbed) */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <TabbedPanelGroup
            tabs={[
              { 
                id: 'business', 
                label: (
                  <>
                    <span className="truncate w-full text-center">商业</span>
                    <span className="text-[10px] opacity-70 font-normal truncate w-full text-center tracking-normal">Business</span>
                  </>
                ), 
                content: <Business /> 
              },
              { 
                id: 'investments', 
                label: (
                  <>
                    <span className="truncate w-full text-center">投资</span>
                    <span className="text-[10px] opacity-70 font-normal truncate w-full text-center tracking-normal">Investments</span>
                  </>
                ), 
                content: <Investments />, 
                condition: investmentEngineUnlocked 
              },
              { 
                id: 'strategic_modeling', 
                label: (
                  <>
                    <span className="truncate w-full text-center">战略建模</span>
                    <span className="text-[10px] opacity-70 font-normal truncate w-full text-center tracking-normal">Strategic</span>
                  </>
                ), 
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
                  label: (
                    <>
                      <span className="truncate w-full text-center">计算</span>
                      <span className="text-[10px] opacity-70 font-normal truncate w-full text-center tracking-normal">Computing</span>
                    </>
                  ), 
                  content: <Computing /> 
                },
                { 
                  id: 'quantum_computing', 
                  label: (
                    <>
                      <span className="truncate w-full text-center">量子计算</span>
                      <span className="text-[10px] opacity-70 font-normal truncate w-full text-center tracking-normal">Quantum</span>
                    </>
                  ), 
                  content: <QuantumComputing />, 
                  condition: qComputingUnlocked 
                },
                { 
                  id: 'projects', 
                  label: (
                    <>
                      <span className="truncate w-full text-center">项目</span>
                      <span className="text-[10px] opacity-70 font-normal truncate w-full text-center tracking-normal">Projects</span>
                    </>
                  ), 
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
      <footer className="mt-12 mb-4 text-center text-xs text-evolve-textDim uppercase tracking-wider opacity-50">
        Universal Paperclips Remake · Original by Decision Problem
      </footer>
    </div>
  );
}

export default App;
