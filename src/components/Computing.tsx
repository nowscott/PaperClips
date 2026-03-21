import { useGameStore } from '../store/gameStore';
import { Cpu, HardDrive, Unlock } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

export const Computing = () => {
  const { 
    trust, 
    availableTrust, 
    nextTrustStage, 
    clips, 
    processors, 
    memory, 
    ops, 
    maxOps,
    creativity,
    creativityOn,
    compAndProjectsUnlocked,
    addProcessor,
    addMemory
  } = useGameStore();

  // 2000 个回形针前，完全不显示计算面板
  if (!compAndProjectsUnlocked) {
    return null;
  }

  // 2000 个解锁面板后，但在 3000 个(或者首个信任值) 之前，显示未解锁/进度状态
  if (trust === 0 && clips < nextTrustStage) {
    const progress = Math.min(100, (clips / nextTrustStage) * 100);
    return (
      <div className="panel flex flex-col gap-4 opacity-50">
        <div className="py-6 flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-evolve-textDim tracking-wider">
            系统离线...
          </p>
          <div className="panel-inner w-full">
            <div className="flex justify-between text-xs mb-2 text-evolve-textDim tracking-wider">
              <span>获取信任进度</span>
              <span>{formatNumber(clips)} / {formatNumber(nextTrustStage)}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill bg-evolve-textDim" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 信任值系统已解锁
  return (
    <div className="panel flex flex-col gap-3 border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.05)]">
      {/* 信任值概览 (紧凑行) */}
      <div className="flex justify-between items-center bg-evolve-bg/50 p-2 rounded border border-evolve-border/50">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Unlock className="w-3.5 h-3.5 text-evolve-textMain" />
            <span className="text-xs text-evolve-textDim tracking-wider font-bold">信任值</span>
          </div>
          <span className="text-[10px] text-evolve-textDim opacity-70 mt-1">下一级: {formatNumber(nextTrustStage)} 件</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-lg leading-none">{formatNumber(trust)}</span>
          <span className="text-[10px] text-evolve-accent font-mono mt-1">可用: {formatNumber(availableTrust)}</span>
        </div>
      </div>

      {/* 信任值分配 */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {/* 处理器 */}
        <div className="flex justify-between items-center bg-evolve-border/10 p-1.5 rounded border border-evolve-border/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-evolve-textDim" />
              <span className="text-[10px] text-evolve-textDim font-bold">处理器</span>
            </div>
            <span className="font-mono text-xs">{formatNumber(processors)}</span>
          </div>
          <button 
            className="btn-evolve text-[10px] py-1 px-2"
            onClick={addProcessor}
            disabled={availableTrust <= 0}
          >
            分配
          </button>
        </div>

        {/* 内存 */}
        <div className="flex justify-between items-center bg-evolve-border/10 p-1.5 rounded border border-evolve-border/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-evolve-textDim" />
              <span className="text-[10px] text-evolve-textDim font-bold">内存</span>
            </div>
            <span className="font-mono text-xs">{formatNumber(memory)}</span>
          </div>
          <button 
            className="btn-evolve text-[10px] py-1 px-2"
            onClick={addMemory}
            disabled={availableTrust <= 0}
          >
            分配
          </button>
        </div>
      </div>

      {/* 算力 Operations */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-evolve-textDim tracking-wider font-bold">算力</span>
          <span className="font-mono text-[10px]">{formatNumber(Math.floor(ops))} / {formatNumber(maxOps)}</span>
        </div>
        <div className="w-full h-1.5 bg-evolve-border rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-evolve-textMain transition-all duration-300" 
            style={{ width: `${(ops / maxOps) * 100}%` }}
          />
        </div>
      </div>

      {/* 创造力 Creativity (如果已解锁) */}
      {creativityOn && (
        <div className="flex justify-between items-center bg-evolve-accent/5 p-1.5 rounded border border-evolve-accent/20 mt-1">
          <span className="text-[10px] text-evolve-accent tracking-wider font-bold">创造力</span>
          <span className="font-mono text-sm text-evolve-accent leading-none">{formatNumber(Math.floor(creativity))}</span>
        </div>
      )}
    </div>
  );
};