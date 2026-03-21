import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface Tab {
  id: string;
  label: React.ReactNode;
  icon?: keyof typeof Icons;
  content: React.ReactNode;
  condition?: boolean; // 如果 condition 为 false，则不显示该 tab
}

interface TabbedPanelGroupProps {
  tabs: Tab[];
  className?: string;
}

export const TabbedPanelGroup: React.FC<TabbedPanelGroupProps> = ({ tabs, className = '' }) => {
  // 过滤掉不可见的 tab
  const visibleTabs = tabs.filter(tab => tab.condition === undefined || tab.condition);
  
  const [activeTabId, setActiveTabId] = useState<string>(visibleTabs[0]?.id || '');

  // 如果当前激活的 tab 被隐藏了，自动切换到第一个可见的 tab
  if (visibleTabs.length > 0 && !visibleTabs.find(t => t.id === activeTabId)) {
    setActiveTabId(visibleTabs[0].id);
  }

  if (visibleTabs.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Tabs Header */}
      <div className="flex w-full border-b border-evolve-border/50">
        {visibleTabs.map(tab => {
          const IconComponent = tab.icon ? Icons[tab.icon] as React.ElementType : null;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex-1 min-w-0 px-1 py-1 text-[11px] font-bold tracking-wider transition-all duration-200 flex flex-row items-center justify-center gap-1
                ${
                  activeTabId === tab.id
                    ? 'text-evolve-accent border-b-2 border-evolve-accent bg-evolve-accent/10 shadow-[inset_0_-2px_10px_rgba(0,168,255,0.05)]'
                    : 'text-evolve-textDim hover:text-evolve-textMain hover:bg-evolve-border/20 border-b-2 border-transparent'
                }`}
            >
              {IconComponent && <IconComponent className={`w-3 h-3 ${activeTabId === tab.id ? 'animate-pulse-slow' : ''}`} />}
              <span className="truncate leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 mt-2">
        {visibleTabs.find(tab => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};
