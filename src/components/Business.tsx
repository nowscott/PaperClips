import { useGameStore } from '../store/gameStore';
import { useContinuousClick } from '../hooks/useContinuousClick';
import { DollarSign, TrendingUp, ShoppingCart, ChevronDown, ChevronUp, ChevronsDown, ChevronsUp, Megaphone } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

export const Business = () => {
  const { 
    funds, unsoldInventory, price, publicDemand, 
    wireCost, prevWireCost, buyWire, raisePrice, lowerPrice,
    marketingLevel, marketingCost, upgradeMarketing,
    revTrackerUnlocked, revenuePerSecond, salesPerSecond
  } = useGameStore();

  const lowerFast = useContinuousClick(() => lowerPrice(0.10));
  const lowerSlow = useContinuousClick(() => lowerPrice(0.01));
  const raiseSlow = useContinuousClick(() => raisePrice(0.01));
  const raiseFast = useContinuousClick(() => raisePrice(0.10));

  const isWireCostUp = wireCost > prevWireCost;
  const isWireCostDown = wireCost < prevWireCost;

  return (
    <div className="panel flex flex-col gap-4">
      <div className="flex flex-col gap-5">
        {/* 资金 */}
        <div className="panel-inner flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-evolve-success" />
              <span className="text-sm text-evolve-textDim tracking-wider">可用资金</span>
            </div>
            <span className="font-mono text-evolve-success text-lg">${formatNumber(funds, 2)}</span>
          </div>
          {revTrackerUnlocked && (
            <>
              <div className="flex justify-between items-center border-t border-evolve-border pt-2 mt-1">
                <span className="text-xs text-evolve-textDim tracking-wider">营收速率</span>
                <span className="font-mono text-sm text-evolve-accent">${formatNumber(revenuePerSecond, 2)}/秒</span>
              </div>
              <div className="flex justify-between items-center border-t border-evolve-border pt-2 mt-1">
                <span className="text-xs text-evolve-textDim tracking-wider">销售速率</span>
                <span className="font-mono text-sm text-evolve-accent">{formatNumber(Math.floor(salesPerSecond))}件/秒</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center border-t border-evolve-border pt-2 mt-1">
            <span className="text-xs text-evolve-textDim tracking-wider">积压库存</span>
            <span className="font-mono text-sm">{formatNumber(unsoldInventory)}件</span>
          </div>
        </div>

      <div className="flex flex-col gap-1 mt-1">
        {/* 定价控制 */}
        <div className="flex flex-col bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50 gap-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-evolve-textMain" />
              <span className="text-xs font-bold leading-none">产品单价</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <TrendingUp className="w-2.5 h-2.5 text-evolve-textDim" />
              <span className="text-evolve-textDim">需求</span>
              <span>{formatNumber(publicDemand)}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-evolve-border/20 rounded p-1">
            <div className="flex gap-1">
              <button className="btn-evolve p-1 hover:bg-evolve-danger/10 hover:text-evolve-danger hover:border-evolve-danger/50" {...lowerFast} title="大降价 $0.10">
                <ChevronsDown className="w-3.5 h-3.5 pointer-events-none" />
              </button>
              <button className="btn-evolve p-1 hover:bg-evolve-danger/10 hover:text-evolve-danger hover:border-evolve-danger/50" {...lowerSlow} title="小降价 $0.01">
                <ChevronDown className="w-3.5 h-3.5 pointer-events-none" />
              </button>
            </div>
            
            <span className="font-mono text-sm text-evolve-success font-bold">${formatNumber(price, 2)}</span>
            
            <div className="flex gap-1">
              <button className="btn-evolve p-1 hover:bg-evolve-success/10 hover:text-evolve-success hover:border-evolve-success/50" {...raiseSlow} title="小涨价 $0.01">
                <ChevronUp className="w-3.5 h-3.5 pointer-events-none" />
              </button>
              <button className="btn-evolve p-1 hover:bg-evolve-success/10 hover:text-evolve-success hover:border-evolve-success/50" {...raiseFast} title="大涨价 $0.10">
                <ChevronsUp className="w-3.5 h-3.5 pointer-events-none" />
              </button>
            </div>
          </div>
        </div>

        {/* 营销系统 */}
        <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-evolve-textMain" />
              <span className="text-xs font-bold leading-none">营销 Lv.{marketingLevel}</span>
            </div>
            <span className="text-[10px] font-mono opacity-70 mt-1">成本: ${formatNumber(marketingCost, 2)}</span>
          </div>
          <button 
            className="btn-evolve text-[10px] py-0.5 px-2 flex items-center gap-1"
            onClick={upgradeMarketing}
            disabled={funds < marketingCost}
          >
            <TrendingUp className="w-3 h-3" />
            扩大宣传
          </button>
        </div>

        {/* 购买铁丝 */}
        <div className="flex justify-between items-center bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-evolve-textMain" />
              <span className="text-xs font-bold leading-none">采购原材料</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono mt-1">
              <span className="opacity-70">市价: ${formatNumber(wireCost)}</span>
              {isWireCostUp && <TrendingUp className="w-2.5 h-2.5 text-evolve-danger" />}
              {isWireCostDown && <TrendingUp className="w-2.5 h-2.5 text-evolve-success transform rotate-180 scale-y-[-1]" />}
            </div>
          </div>
          <button 
            className="btn-evolve text-[10px] py-0.5 px-2 flex items-center gap-1"
            onClick={buyWire}
            disabled={funds < wireCost}
          >
            <ShoppingCart className="w-3 h-3" />
            进货
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};