import { useGameStore } from '../store/gameStore';
import { useContinuousClick } from '../hooks/useContinuousClick';
import { Zap, Cpu, Factory } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

export const Manufacturing = () => {
  const { 
    wire, 
    makePaperclip, 
    autoClippers, 
    autoClipperCost, 
    buyAutoClipper,
    megaClippersUnlocked,
    megaClippers,
    megaClipperCost,
    buyMegaClipper,
    funds,
    clipsPerSecond,
    hasWireBuyer,
    wireBuyerOn,
    toggleWireBuyer,
    tothFlag,
    hypnoDronesReleased
  } = useGameStore();
  
  const maxWire = 1000;
  const wirePercent = Math.min(100, Math.max(0, (wire / maxWire) * 100));

  const makePaperclipContinuous = useContinuousClick(makePaperclip, 50, 200);

  return (
    <div className="panel flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {/* 制造按钮 */}
        <button 
          className="btn-evolve btn-evolve-accent w-full py-3 flex items-center justify-center gap-2 select-none touch-none"
          {...makePaperclipContinuous}
          disabled={wire <= 0}
        >
          <Zap className="w-4 h-4" />
          <span className="font-bold tracking-wider">手工制造</span>
        </button>

        {/* 资源状态 */}
        <div className="panel-inner">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-evolve-textDim tracking-wider">原材料 (铁丝)</span>
            <span className="font-mono text-evolve-textMain">{formatNumber(wire)} <span className="text-xs text-evolve-textDim">英寸</span></span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${wirePercent}%` }}
            />
          </div>
          
          {!hypnoDronesReleased && hasWireBuyer && (
            <div className="flex items-center justify-between mt-3 animate-fade-in">
              <span className="text-xs text-evolve-textDim tracking-wider">自动采购机</span>
              <button 
                className={`text-xs px-2 py-1 rounded border uppercase tracking-wider transition-colors ${
                  wireBuyerOn 
                    ? 'border-evolve-success text-evolve-success bg-evolve-success/10' 
                    : 'border-evolve-textDim text-evolve-textDim hover:border-evolve-textMain'
                }`}
                onClick={toggleWireBuyer}
              >
                {wireBuyerOn ? '运行中' : '已停机'}
              </button>
            </div>
          )}
        </div>

        {/* 自动制造机 (第一阶段显示) */}
        {!hypnoDronesReleased && (
          <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50 mt-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-evolve-textDim" />
                <span className="text-xs font-bold leading-none">自动制造机</span>
              </div>
              <span className="text-[10px] font-mono opacity-70 mt-1">造价: ${formatNumber(autoClipperCost, 2)}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm leading-none">{formatNumber(autoClippers)}</span>
              <button 
                className="btn-evolve text-[10px] py-0.5 px-2"
                onClick={buyAutoClipper}
                disabled={funds < autoClipperCost}
              >
                组装
              </button>
            </div>
          </div>
        )}

        {/* 巨型制造机 (第一阶段显示) */}
        {!hypnoDronesReleased && megaClippersUnlocked && (
          <div className="flex justify-between items-center bg-evolve-accent/5 p-1.5 rounded border border-evolve-accent/20">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-evolve-accent" />
                <span className="text-xs font-bold text-evolve-accent leading-none">巨型制造机</span>
              </div>
              <span className="text-[10px] font-mono opacity-70 mt-1">造价: ${formatNumber(megaClipperCost, 2)}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm text-evolve-accent leading-none">{formatNumber(megaClippers)}</span>
              <button 
                className="btn-evolve btn-evolve-accent text-[10px] py-0.5 px-2"
                onClick={buyMegaClipper}
                disabled={funds < megaClipperCost}
              >
                组装
              </button>
            </div>
          </div>
        )}

        {/* 产能统计 */}
        {!hypnoDronesReleased && (autoClippers > 0 || megaClippers > 0) && !tothFlag && (
          <div className="mt-2 text-right text-xs font-mono text-evolve-textDim animate-fade-in">
            当前产能: {formatNumber(Math.floor(clipsPerSecond))} 件/秒
          </div>
        )}
      </div>
    </div>
  );
};