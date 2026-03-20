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
    <div className="panel flex flex-col gap-4 border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.05)]">
      <div className="flex flex-col gap-5">
        {/* 信任值概览 */}
        <div className="panel-inner flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Unlock className="w-4 h-4 text-evolve-textMain" />
            <span className="text-sm text-evolve-textDim tracking-wider">信任值</span>
          </div>
          <span className="font-mono text-lg">{formatNumber(trust)}</span>
        </div>

        {/* 信任值分配 */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end text-sm">
            <span className="text-evolve-textDim tracking-wider">下一信任值阈值:</span>
            <span className="font-mono">{formatNumber(nextTrustStage)} 件</span>
          </div>
          
          <div className="text-sm text-evolve-accent font-mono bg-evolve-accent/10 px-3 py-1 rounded w-fit">
            可用信任: {formatNumber(availableTrust)}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* 处理器 */}
            <div className="panel-inner flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-sm text-evolve-textDim">
                  <Cpu className="w-4 h-4" />
                  <span>处理器</span>
                </div>
                <span className="font-mono">{formatNumber(processors)}</span>
              </div>
              <button 
                className="btn-evolve text-xs py-1"
                onClick={addProcessor}
                disabled={availableTrust <= 0}
              >
                分配
              </button>
            </div>

            {/* 内存 */}
            <div className="panel-inner flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-sm text-evolve-textDim">
                  <HardDrive className="w-4 h-4" />
                  <span>内存</span>
                </div>
                <span className="font-mono">{formatNumber(memory)}</span>
              </div>
              <button 
                className="btn-evolve text-xs py-1"
                onClick={addMemory}
                disabled={availableTrust <= 0}
              >
                分配
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 算力 Operations */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm text-evolve-textDim tracking-wider">算力</span>
            <span className="font-mono">{formatNumber(Math.floor(ops))} / {formatNumber(maxOps)}</span>
          </div>
          <div className="progress-bar-container h-2">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(ops / maxOps) * 100}%` }}
            />
          </div>
        </div>

        {/* 创造力 Creativity (如果已解锁) */}
        {creativityOn && (
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm text-evolve-accent tracking-wider">创造力</span>
              <span className="font-mono text-evolve-accent">{formatNumber(Math.floor(creativity))}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};