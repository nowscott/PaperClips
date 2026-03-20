import React, { useState } from 'react';

interface Tab {
  id: string;
  label: React.ReactNode;
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
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex-1 min-w-0 px-1 py-2 text-sm font-bold uppercase tracking-wider transition-colors flex flex-col items-center justify-center gap-1
              ${
                activeTabId === tab.id
                  ? 'text-evolve-accent border-b-2 border-evolve-accent bg-evolve-accent/5'
                  : 'text-evolve-textDim hover:text-evolve-textMain hover:bg-evolve-border/20'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {visibleTabs.find(tab => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};
