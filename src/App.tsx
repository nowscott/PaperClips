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

function App() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <GameLoop />
      {/* 顶部状态栏 */}
      <Header />

      {/* 终端日志区 (横跨全宽) */}
      <div className="mb-6">
        <ConsoleLog />
      </div>

      {/* 主体布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* 左侧：制造与项目控制 */}
        <div className="flex flex-col gap-6">
          <Manufacturing />
          <SpaceAndDrones />
          <Projects />
        </div>

        {/* 中间：商业与投资 */}
        <div className="flex flex-col gap-6">
          <Business />
          <Investments />
          <StrategicModeling />
        </div>

        {/* 右侧：计算与太空 */}
        <div className="flex flex-col gap-6">
          <SpaceExploration />
          <QuantumComputing />
          <Computing />
        </div>
      </div>
      
      {/* 底部开源声明 */}
      <footer className="mt-12 text-center text-xs text-evolve-textDim uppercase tracking-wider opacity-50">
        Universal Paperclips Remake · Original by Decision Problem
      </footer>
    </div>
  );
}

export default App;
