import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { INITIAL_PROJECTS, type Project } from '../data/projects';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const Projects = () => {
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  
  const { 
    ops, 
    funds,
    creativity,
    yomi,
    trust,
    completedProjects, 
    compAndProjectsUnlocked,
    completeProject 
  } = useGameStore();

  if (!compAndProjectsUnlocked) {
    return null; // 在 2000 clips 之前不显示项目面板
  }

  // 过滤出当前应该显示在列表中的项目
  // 规则：只要符合 isUnlocked 条件，且未被完成，就显示。
  const availableProjects = INITIAL_PROJECTS.filter(
    (p) => !completedProjects.includes(p.id) && p.isUnlocked(useGameStore.getState())
  );

  // 获取已完成的项目
  const allCompletedProjects = completedProjects
    .map((id: string) => INITIAL_PROJECTS.find(p => p.id === id))
    .filter((p: Project | undefined): p is Project => p !== undefined)
    .reverse(); // 最新完成的在前面

  // 获取最近完成的3个项目用于默认展示
  const recentCompleted = allCompletedProjects.slice(0, 3);

  if (availableProjects.length === 0 && allCompletedProjects.length === 0) {
    return null; // 如果没有任何项目解锁，完全隐藏该面板
  }

  const completedToDisplay = showAllCompleted ? allCompletedProjects : recentCompleted;

  return (
    <div className="panel flex flex-col gap-2 border-evolve-success/30 shadow-[0_0_15px_rgba(var(--color-success),0.05)]">
      <div className="flex flex-col gap-1.5">
        {/* 可用项目列表 */}
        {availableProjects.length > 0 ? (
          availableProjects.map((project) => {
            const canAffordOps = ops >= project.costOps;
            const canAffordFunds = project.costFunds === undefined || funds >= project.costFunds;
            const canAffordCreativity = project.costCreativity === undefined || creativity >= project.costCreativity;
            const canAffordYomi = project.costYomi === undefined || yomi >= project.costYomi;
            const canAffordTrust = project.costTrust === undefined || trust >= project.costTrust;
            
            const canAfford = canAffordOps && canAffordFunds && canAffordCreativity && canAffordYomi && canAffordTrust;

            return (
              <div key={project.id} className="flex flex-col bg-evolve-bg/50 p-1.5 rounded border border-evolve-border/50 gap-1 transition-all hover:border-evolve-success/30">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-bold text-evolve-textMain leading-tight">{project.title}</span>
                    <p className="text-[10px] text-evolve-textDim leading-tight opacity-90 mt-0.5">
                      {project.description}
                    </p>
                  </div>
                  <button
                    className="btn-evolve text-[10px] py-0.5 px-2 border-evolve-success text-evolve-success hover:bg-evolve-success/20 disabled:border-evolve-border disabled:text-evolve-textDim whitespace-nowrap shrink-0 h-fit"
                    onClick={() => completeProject(project.id)}
                    disabled={!canAfford}
                  >
                    研发
                  </button>
                </div>
                
                <div className="flex gap-2 text-[10px] font-mono flex-wrap bg-evolve-border/10 px-1 py-0.5 rounded">
                  {project.costOps > 0 && (
                    <span className={canAffordOps ? 'text-evolve-textDim' : 'text-evolve-danger'}>
                      算力: {project.costOps}
                    </span>
                  )}
                  {project.costFunds && (
                    <span className={canAffordFunds ? 'text-evolve-textDim' : 'text-evolve-danger'}>
                      资金: ${project.costFunds.toFixed(2)}
                    </span>
                  )}
                  {project.costCreativity && (
                    <span className={canAffordCreativity ? 'text-evolve-accent' : 'text-evolve-danger'}>
                      创造力: {project.costCreativity}
                    </span>
                  )}
                  {project.costYomi && (
                    <span className={canAffordYomi ? 'text-evolve-warning' : 'text-evolve-danger'}>
                      预判值: {project.costYomi.toLocaleString()}
                    </span>
                  )}
                  {project.costTrust && (
                    <span className={canAffordTrust ? 'text-evolve-textDim' : 'text-evolve-danger'}>
                      信任值: {project.costTrust}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-[10px] text-evolve-textDim italic py-1">
            等待新发现...
          </div>
        )}

        {/* 已完成项目记录 */}
        {allCompletedProjects.length > 0 && (
          <div className="mt-1 border-t border-evolve-border/50 pt-1.5">
            <div 
              className="flex items-center justify-between cursor-pointer group mb-1"
              onClick={() => setShowAllCompleted(!showAllCompleted)}
            >
              <h3 className="text-[10px] text-evolve-textDim tracking-wider font-bold group-hover:text-evolve-textMain transition-colors">
                {showAllCompleted ? '全部已完成项目' : '近期已完成'} ({allCompletedProjects.length})
              </h3>
              {showAllCompleted ? (
                <ChevronUp className="w-3 h-3 text-evolve-textDim group-hover:text-evolve-textMain" />
              ) : (
                <ChevronDown className="w-3 h-3 text-evolve-textDim group-hover:text-evolve-textMain" />
              )}
            </div>
            
            <div className={`flex flex-col gap-0.5 ${showAllCompleted ? 'max-h-60 overflow-y-auto pr-1 custom-scrollbar' : ''}`}>
              {completedToDisplay.map((p: Project) => (
                <div key={p.id} className="flex items-center gap-1.5 text-[10px] text-evolve-textDim opacity-70 hover:opacity-100 transition-opacity py-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-evolve-success shrink-0" />
                  <span className="truncate">{p.title}</span>
                </div>
              ))}
            </div>
            
            {!showAllCompleted && allCompletedProjects.length > 3 && (
              <div 
                className="text-[9px] text-evolve-textDim/50 text-center mt-1 cursor-pointer hover:text-evolve-textDim transition-colors"
                onClick={() => setShowAllCompleted(true)}
              >
                点击展开全部...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};