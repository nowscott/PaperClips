import { useGameStore } from '../store/gameStore';
import { Paperclip } from 'lucide-react';
import { Settings } from './Settings';

export const Header = () => {
  const { clips } = useGameStore();

  return (
    <header className="panel mb-6 flex justify-between items-center border-b-2 border-b-evolve-accent">
      <div className="flex items-center gap-3">
        <Paperclip className="text-evolve-accent w-6 h-6" />
        <h1 className="text-xl font-bold tracking-widest text-evolve-textMain">
          无限回形针 <span className="text-sm opacity-50 font-normal hidden sm:inline">INFINITE PAPERCLIPS</span>
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-evolve-textDim uppercase tracking-wider mb-1">总制造量 (Total Clips)</div>
          <div className="text-2xl font-mono text-evolve-accent font-bold">
            {clips.toLocaleString()}
          </div>
        </div>
        <Settings />
      </div>
    </header>
  );
};
