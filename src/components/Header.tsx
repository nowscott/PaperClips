import { useGameStore } from '../store/gameStore';
import { Paperclip } from 'lucide-react';
import { Settings } from './Settings';
import { formatNumber } from '../utils/formatNumber';

export const Header = () => {
  const { clips, clipsPerSecond } = useGameStore();

  return (
    <header className="panel mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-end border-b-2 border-b-evolve-accent gap-2 sm:gap-0 pb-2 sm:pb-3">
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2 sm:gap-3">
          <Paperclip className="text-evolve-accent w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-lg sm:text-xl font-bold tracking-widest text-evolve-textMain">
            无限回形针 <span className="text-xs sm:text-sm opacity-50 font-normal hidden sm:inline">INFINITE PAPERCLIPS</span>
          </h1>
        </div>
        {/* 在移动端将设置按钮放到标题栏右侧 */}
        <div className="sm:hidden">
          <Settings />
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div className="text-right flex flex-col justify-center w-full sm:w-auto">
          <div className="flex items-baseline justify-between sm:justify-end gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs text-evolve-textDim uppercase tracking-wider">总制造量</span>
            <span className="text-xl sm:text-2xl font-mono text-evolve-accent font-bold leading-none truncate max-w-[200px] sm:max-w-none">
              {formatNumber(clips)}
            </span>
          </div>
          <div className="h-3 flex justify-end items-center mt-1">
            {clipsPerSecond > 0 && (
              <span className="text-[10px] text-evolve-textDim font-mono">
                +{formatNumber(Math.floor(clipsPerSecond))} / 秒
              </span>
            )}
          </div>
        </div>
        {/* 桌面端设置按钮 */}
        <div className="hidden sm:block">
          <Settings />
        </div>
      </div>
    </header>
  );
};
