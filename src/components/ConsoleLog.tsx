import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';

export const ConsoleLog = () => {
  const logs = useGameStore((state) => state.logs);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 当有新日志时，自动滚动到最底部
  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  const displayLogs = isExpanded ? logs : logs.slice(-1);

  return (
    <div className="panel flex flex-col gap-2 border-evolve-textDim/30 shadow-inner transition-all duration-300">
      <div 
        className="flex justify-between items-center border-b border-evolve-border pb-2 opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <h2 className="text-sm font-bold tracking-widest uppercase">无限回形针</h2>
        </div>
        <button className="text-evolve-textDim hover:text-evolve-textMain transition-colors">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      <div 
        ref={scrollRef}
        className={`font-mono text-xs text-evolve-textMain/80 flex flex-col gap-1 pr-2 transition-all duration-300 ${isExpanded ? 'overflow-y-auto min-h-[150px] max-h-[200px] h-[200px]' : 'max-h-[24px] overflow-hidden'}`}
      >
        {displayLogs.map((log) => {
          const time = new Date(log.timestamp);
          const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
          
          return (
            <div key={log.id} className="flex gap-3 items-start animate-fade-in shrink-0">
              <span className="text-evolve-textDim opacity-50 select-none shrink-0">[{timeStr}]</span>
              <span className="flex-1 break-words">
                <span className="text-evolve-accent opacity-50 mr-2">{'>'}</span>
                {log.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
