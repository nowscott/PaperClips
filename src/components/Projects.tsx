import { useGameStore } from '../store/gameStore';
import { INITIAL_PROJECTS, type Project } from '../data/projects';
import { CheckCircle2 } from 'lucide-react';

export const Projects = () => {
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

  // 获取最近完成的3个项目用于展示记录
  const recentCompleted = completedProjects
    .map((id: string) => INITIAL_PROJECTS.find(p => p.id === id))
    .filter((p: Project | undefined): p is Project => p !== undefined)
    .slice(-3)
    .reverse();

  if (availableProjects.length === 0 && recentCompleted.length === 0) {
    return null; // 如果没有任何项目解锁，完全隐藏该面板
  }

  return (
    <div className="panel flex flex-col gap-4 border-evolve-success/30 shadow-[0_0_15px_rgba(var(--color-success),0.05)]">
      <div className="flex flex-col gap-3">
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
              <div key={project.id} className="panel-inner flex flex-col gap-2">
                <div className="flex justify-between items-start gap-3">
                  <span className="font-bold text-evolve-textMain break-words flex-1">{project.title}</span>
                  <button
                    className="btn-evolve text-xs py-1 px-3 border-evolve-success text-evolve-success hover:bg-evolve-success/20 disabled:border-evolve-border disabled:text-evolve-textDim whitespace-nowrap shrink-0"
                    onClick={() => completeProject(project.id)}
                    disabled={!canAfford}
                  >
                    研发
                  </button>
                </div>
                <p className="text-xs text-evolve-textDim leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 mt-1 text-xs font-mono flex-wrap">
                  {project.costOps > 0 && (
                    <span className={canAffordOps ? 'text-evolve-textMain' : 'text-evolve-danger'}>
                      算力: {project.costOps}
                    </span>
                  )}
                  {project.costFunds && (
                    <span className={canAffordFunds ? 'text-evolve-textMain' : 'text-evolve-danger'}>
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
                    <span className={canAffordTrust ? 'text-evolve-textMain' : 'text-evolve-danger'}>
                      信任值: {project.costTrust}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-evolve-textDim italic py-4">
            等待新发现...
          </div>
        )}

        {/* 已完成项目记录 */}
        {recentCompleted.length > 0 && (
          <div className="mt-4 border-t border-evolve-border pt-4">
            <h3 className="text-xs text-evolve-textDim tracking-wider mb-2">近期已完成</h3>
            <div className="flex flex-col gap-1">
              {recentCompleted.map((p: Project) => (
                <div key={p.id} className="flex items-center gap-2 text-sm text-evolve-textDim opacity-70">
                  <CheckCircle2 className="w-3 h-3 text-evolve-success" />
                  <span>{p.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};