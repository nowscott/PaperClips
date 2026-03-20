import { useGameStore } from '../store/gameStore';
import { DollarSign, TrendingUp, ShoppingCart, ChevronDown, ChevronUp, Megaphone } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

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

        {/* 定价控制 */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm text-evolve-textDim tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>产品单价</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs pl-5">
              <TrendingUp className="w-3.5 h-3.5 text-evolve-textDim" />
              <span className="text-evolve-textDim">需求</span>
              <span className="font-mono">{formatNumber(publicDemand)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-evolve p-1" onClick={lowerPrice}>
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="font-mono w-16 text-center">${formatNumber(price, 2)}</span>
            <button className="btn-evolve p-1" onClick={raisePrice}>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 营销系统 */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm text-evolve-textDim tracking-wider">
              <Megaphone className="w-4 h-4" />
              <span>营销 Lv.{marketingLevel}</span>
            </div>
            <span className="text-xs font-mono opacity-70 pl-5">成本: ${formatNumber(marketingCost, 2)}</span>
          </div>
          <button 
            className="btn-evolve flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs tracking-wider"
            onClick={upgradeMarketing}
            disabled={funds < marketingCost}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>扩大宣传</span>
          </button>
        </div>

        <div className="h-px bg-evolve-border w-full my-1"></div>

        {/* 购买铁丝 */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm text-evolve-textDim tracking-wider">
              <ShoppingCart className="w-4 h-4" />
              <span>采购原材料</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono pl-5">
              <span className="opacity-70">市价: ${formatNumber(wireCost)}</span>
              {isWireCostUp && <TrendingUp className="w-3 h-3 text-evolve-danger" />}
              {isWireCostDown && <TrendingUp className="w-3 h-3 text-evolve-success transform rotate-180 scale-y-[-1]" />}
            </div>
          </div>
          <button 
            className="btn-evolve flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs tracking-wider"
            onClick={buyWire}
            disabled={funds < wireCost}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>进货</span>
          </button>
        </div>
      </div>
    </div>
  );
};