import { useGameStore } from '../store/gameStore';
import { Paperclip, RefreshCw } from 'lucide-react';

export const Header = () => {
  const { clips, resetGame } = useGameStore();

  const handleReset = () => {
    if (window.confirm("警告：确定要硬重置游戏吗？所有进度将丢失。 (WARNING: Hard reset game?)")) {
      resetGame();
    }
  };

  return (
    <header className="panel mb-6 flex justify-between items-center border-b-2 border-b-evolve-accent">
      <div className="flex items-center gap-3">
        <Paperclip className="text-evolve-accent w-6 h-6" />
        <h1 className="text-xl font-bold tracking-widest text-evolve-textMain">
          通用回形针 <span className="text-sm opacity-50 font-normal">UNIVERSAL PAPERCLIPS</span>
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-evolve-textDim uppercase tracking-wider mb-1">总制造量 (Total Clips)</div>
          <div className="text-2xl font-mono text-evolve-accent font-bold">
            {clips.toLocaleString()}
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="btn-evolve p-2 text-evolve-danger border-evolve-danger/30 hover:bg-evolve-danger/10 hover:border-evolve-danger"
          title="硬重置 (Hard Reset)"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
