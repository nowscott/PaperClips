import { useGameStore } from '../store/gameStore';
import { Briefcase, DollarSign, TrendingUp, ShoppingCart, ChevronDown, ChevronUp, Megaphone } from 'lucide-react';

export const Business = () => {
  const { 
    funds, unsoldInventory, price, publicDemand, 
    wireCost, prevWireCost, buyWire, raisePrice, lowerPrice,
    marketingLevel, marketingCost, upgradeMarketing,
    revTrackerUnlocked, revenuePerSecond, salesPerSecond
  } = useGameStore();

  const isWireCostUp = wireCost > prevWireCost;
  const isWireCostDown = wireCost < prevWireCost;

  return (
    <div className="panel flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-evolve-border pb-2">
        <Briefcase className="w-5 h-5 text-evolve-textDim" />
        <h2 className="text-lg font-bold tracking-wide uppercase">商业 <span className="text-sm opacity-50 font-normal">Business</span></h2>
      </div>

      <div className="flex flex-col gap-5 mt-2">
        {/* 资金 */}
        <div className="panel-inner flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-evolve-success" />
              <span className="text-sm text-evolve-textDim uppercase tracking-wider">可用资金 (Funds)</span>
            </div>
            <span className="font-mono text-evolve-success text-lg">${funds.toFixed(2)}</span>
          </div>
          {revTrackerUnlocked && (
            <>
              <div className="flex justify-between items-center border-t border-evolve-border pt-2 mt-1">
                <span className="text-xs text-evolve-textDim uppercase tracking-wider">每秒收益 (Rev/sec)</span>
                <span className="font-mono text-sm text-evolve-accent">${revenuePerSecond.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-evolve-border pt-2 mt-1">
                <span className="text-xs text-evolve-textDim uppercase tracking-wider">每秒销售量 (Sales/sec)</span>
                <span className="font-mono text-sm text-evolve-accent">{Math.floor(salesPerSecond).toLocaleString()}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center border-t border-evolve-border pt-2 mt-1">
            <span className="text-xs text-evolve-textDim uppercase tracking-wider">未销售库存 (Unsold Inventory)</span>
            <span className="font-mono text-sm">{unsoldInventory.toLocaleString()}</span>
          </div>
        </div>

        {/* 定价控制 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-evolve-textDim uppercase tracking-wider">单价 (Price)</span>
            <div className="flex items-center gap-2">
              <button className="btn-evolve p-1" onClick={lowerPrice}>
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="font-mono w-16 text-center">${price.toFixed(2)}</span>
              <button className="btn-evolve p-1" onClick={raisePrice}>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1.5 text-evolve-textDim">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>公众需求 (Public Demand)</span>
            </div>
            <span className="font-mono">{publicDemand}%</span>
          </div>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 营销系统 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 text-sm text-evolve-textDim uppercase tracking-wider">
              <Megaphone className="w-4 h-4" />
              <span>营销等级 (Marketing)</span>
            </div>
            <span className="font-mono text-lg">Lv.{marketingLevel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono opacity-70">成本: ${marketingCost.toFixed(2)}</span>
            <button 
              className="btn-evolve text-xs py-1.5 px-3"
              onClick={upgradeMarketing}
              disabled={funds < marketingCost}
            >
              升级 (Upgrade)
            </button>
          </div>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 购买铁丝 */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-evolve-textDim uppercase tracking-wider mb-1">购买铁丝 (Buy Wire)</div>
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="opacity-70">成本: ${wireCost}</span>
              {isWireCostUp && <TrendingUp className="w-3 h-3 text-evolve-danger ml-1" />}
              {isWireCostDown && <TrendingUp className="w-3 h-3 text-evolve-success ml-1 transform rotate-180 scale-y-[-1]" />}
            </div>
          </div>
          <button 
            className="btn-evolve flex items-center gap-2"
            onClick={buyWire}
            disabled={funds < wireCost}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>进货 (Purchase)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
