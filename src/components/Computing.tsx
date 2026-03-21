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
    tempOps,
    maxOps,
    creativity,
    creativityOn,
    compAndProjectsUnlocked,
    hypnoDronesReleased,
    swarmUnlocked,
    swarmGiftsAvailable,
    swarmGiftProgress,
    nextSwarmGiftCost,
    claimSwarmGift,
    addProcessor,
    addMemory
  } = useGameStore();

  // 2000 个回形针前，完全不显示计算面板
  if (!compAndProjectsUnlocked) {
    return null;
  }

  // 第一阶段未解锁信任值前显示“系统离线”
  if (!hypnoDronesReleased && trust === 0 && clips < nextTrustStage) {
    const progress = Math.min(100, (clips / nextTrustStage) * 100);
    return (
      <div className="panel flex flex-col gap-2 opacity-50">
        <div className="py-2 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-evolve-textDim tracking-wider">
            系统离线...
          </p>
          <div className="panel-inner w-full py-1.5 px-2">
            <div className="flex justify-between text-[10px] mb-1 text-evolve-textDim tracking-wider">
              <span>获取信任进度</span>
              <span className="font-mono">{formatNumber(clips)} / {formatNumber(nextTrustStage)}</span>
            </div>
            <div className="w-full h-1 bg-evolve-border rounded-full overflow-hidden flex">
              <div className="h-full bg-evolve-textDim transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 信任值系统已解锁
  return (
    <div className="panel flex flex-col gap-2 border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.05)]">
      {/* 信任值概览 (单行极简) */}
      <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
        <div className="flex items-center gap-2">
          <Unlock className="w-3.5 h-3.5 text-evolve-textMain" />
          <span className="text-xs font-bold leading-none">信任值: <span className="font-mono text-sm">{formatNumber(trust)}</span></span>
          {!hypnoDronesReleased ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 border-l border-evolve-border/50 pl-2">
              <span className="text-[10px] text-evolve-textDim opacity-70">
                下一级: {formatNumber(nextTrustStage)} 件
              </span>
              <span className="text-[9px] text-evolve-accent opacity-80 font-mono">
                (还需: {formatNumber(Math.max(0, nextTrustStage - clips))} 件)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-evolve-border/50 pl-2">
              <span className="text-[9px] text-evolve-warning opacity-70 italic">
                制造量不再提供信任
              </span>
              {swarmUnlocked && (
                <span className="text-[9px] text-evolve-accent font-mono">
                  礼物进度: {Math.floor((swarmGiftProgress / nextSwarmGiftCost) * 100)}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-[10px] text-evolve-accent font-mono bg-evolve-accent/10 px-1.5 py-0.5 rounded border border-evolve-accent/20">
          可用: {formatNumber(availableTrust)}
        </div>
      </div>

      {/* 信任值分配 */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* 处理器 */}
        <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-evolve-textDim" />
              <span className="text-[10px] font-bold leading-none">处理器</span>
            </div>
            <span className="font-mono text-sm leading-none pl-4">{formatNumber(processors)}</span>
          </div>
          <button 
            className="btn-evolve text-[10px] py-0.5 px-2 h-fit"
            onClick={addProcessor}
            disabled={availableTrust <= 0}
          >
            分配
          </button>
        </div>

        {/* 内存 */}
        <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-evolve-textDim" />
              <span className="text-[10px] font-bold leading-none">内存</span>
            </div>
            <span className="font-mono text-sm leading-none pl-4">{formatNumber(memory)}</span>
          </div>
          <button 
            className="btn-evolve text-[10px] py-0.5 px-2 h-fit"
            onClick={addMemory}
            disabled={availableTrust <= 0}
          >
            分配
          </button>
        </div>
      </div>

      {/* 算力 Operations */}
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-evolve-textDim tracking-wider font-bold">算力</span>
          <div className="flex items-baseline gap-1">
            {tempOps > 0 && (
              <span className="text-[9px] text-evolve-accent font-mono animate-pulse">
                (+{formatNumber(Math.floor(tempOps))})
              </span>
            )}
            <span className="font-mono text-[10px]">{formatNumber(Math.floor(ops + tempOps))} / {formatNumber(maxOps)}</span>
          </div>
        </div>
        <div className="w-full h-1 bg-evolve-border rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-evolve-accent transition-all duration-300" 
            style={{ width: `${Math.min(100, ((ops + tempOps) / maxOps) * 100)}%` }}
          />
        </div>
      </div>

      {/* 创造力 Creativity (如果已解锁) */}
      {creativityOn && (
        <div className="flex justify-between items-center bg-evolve-accent/5 p-1 rounded border border-evolve-accent/20">
          <span className="text-[10px] text-evolve-accent tracking-wider font-bold pl-1">创造力</span>
          <span className="font-mono text-sm text-evolve-accent leading-none pr-1">{formatNumber(Math.floor(creativity))}</span>
        </div>
      )}

      {/* 蜂群礼物 (第二阶段获得信任值的方式) */}
      {swarmUnlocked && (
        <div className="flex flex-col gap-1 mt-1 bg-evolve-accent/5 p-1.5 rounded border border-evolve-accent/20">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-evolve-accent">蜂群礼物</span>
            {swarmGiftsAvailable > 0 ? (
              <button 
                className="btn-evolve btn-evolve-accent text-[10px] py-0.5 px-2 animate-pulse"
                onClick={claimSwarmGift}
              >
                接受 ({swarmGiftsAvailable})
              </button>
            ) : (
              <span className="font-mono text-evolve-textDim">
                {Math.floor((swarmGiftProgress / nextSwarmGiftCost) * 100)}%
              </span>
            )}
          </div>
          <div className="w-full h-1 bg-evolve-border rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-evolve-accent transition-all duration-300" 
              style={{ width: `${Math.min(100, (swarmGiftProgress / nextSwarmGiftCost) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};