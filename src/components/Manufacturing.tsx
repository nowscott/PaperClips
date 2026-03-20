import { useGameStore } from '../store/gameStore';
import { Hammer, Zap, Cpu, Factory } from 'lucide-react';

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
    toggleWireBuyer
  } = useGameStore();
  
  const maxWire = 1000;
  const wirePercent = Math.min(100, Math.max(0, (wire / maxWire) * 100));

  return (
    <div className="panel flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-evolve-border pb-2">
        <Hammer className="w-5 h-5 text-evolve-textDim" />
        <h2 className="text-lg font-bold tracking-wide uppercase">制造 <span className="text-sm opacity-50 font-normal">Manufacturing</span></h2>
      </div>
      
      <div className="flex flex-col gap-4 mt-2">
        {/* 制造按钮 */}
        <button 
          className="btn-evolve btn-evolve-accent w-full py-3 flex items-center justify-center gap-2"
          onClick={makePaperclip}
          disabled={wire <= 0}
        >
          <Zap className="w-4 h-4" />
          <span className="font-bold tracking-wider">制造回形针 <span className="text-xs opacity-70 font-normal ml-1">MAKE PAPERCLIP</span></span>
        </button>

        {/* 资源状态 */}
        <div className="panel-inner">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-evolve-textDim uppercase tracking-wider">铁丝 (Wire)</span>
            <span className="font-mono text-evolve-textMain">{wire.toLocaleString()} <span className="text-xs text-evolve-textDim">英寸 (inches)</span></span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${wirePercent}%` }}
            />
          </div>
          
          {hasWireBuyer && (
            <div className="flex items-center justify-between mt-3 animate-fade-in">
              <span className="text-xs text-evolve-textDim uppercase tracking-wider">自动进货机 (WireBuyer)</span>
              <button 
                className={`text-xs px-2 py-1 rounded border uppercase tracking-wider transition-colors ${
                  wireBuyerOn 
                    ? 'border-evolve-success text-evolve-success bg-evolve-success/10' 
                    : 'border-evolve-textDim text-evolve-textDim hover:border-evolve-textMain'
                }`}
                onClick={toggleWireBuyer}
              >
                {wireBuyerOn ? 'ON' : 'OFF'}
              </button>
            </div>
          )}
        </div>

        {/* 自动制造机 */}
        <div className="h-px bg-evolve-border w-full my-1"></div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 text-sm text-evolve-textDim uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>自动制造机 (AutoClippers)</span>
            </div>
            <span className="font-mono text-lg">{autoClippers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono opacity-70">成本: ${autoClipperCost.toFixed(2)}</span>
            <button 
              className="btn-evolve text-xs py-1.5 px-3"
              onClick={buyAutoClipper}
              disabled={funds < autoClipperCost}
            >
              组装 (Assemble)
            </button>
          </div>
        </div>

        {/* 巨型制造机 (解锁后显示) */}
        {megaClippersUnlocked && (
          <>
            <div className="h-px bg-evolve-border w-full my-1"></div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 text-sm text-evolve-accent uppercase tracking-wider">
                  <Factory className="w-4 h-4" />
                  <span>巨型制造机 (MegaClippers)</span>
                </div>
                <span className="font-mono text-lg text-evolve-accent">{megaClippers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono opacity-70">成本: ${megaClipperCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <button 
                  className="btn-evolve btn-evolve-accent text-xs py-1.5 px-3"
                  onClick={buyMegaClipper}
                  disabled={funds < megaClipperCost}
                >
                  组装 (Assemble)
                </button>
              </div>
            </div>
          </>
        )}

        {/* 产能统计 */}
        {(autoClippers > 0 || megaClippers > 0) && (
          <div className="mt-2 text-right text-xs font-mono text-evolve-textDim animate-fade-in">
            当前产能: {Math.floor(clipsPerSecond).toLocaleString()} 个/秒
          </div>
        )}
      </div>
    </div>
  );
};
