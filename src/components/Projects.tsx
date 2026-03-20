import { useGameStore } from '../store/gameStore';
import { INITIAL_PROJECTS, type Project } from '../data/projects';
import { FlaskConical, CheckCircle2 } from 'lucide-react';

export const Projects = () => {
  const { 
    ops, 
    funds,
    creativity,
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
    <div className="panel flex flex-col gap-4 border-evolve-success/30 shadow-[0_0_15px_rgba(var(--color-success),0.05)] mt-6">
      <div className="flex items-center gap-2 border-b border-evolve-border pb-2">
        <FlaskConical className="w-5 h-5 text-evolve-success" />
        <h2 className="text-lg font-bold tracking-wide uppercase text-evolve-success">项目 <span className="text-sm opacity-50 font-normal">Projects</span></h2>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {/* 可用项目列表 */}
        {availableProjects.length > 0 ? (
          availableProjects.map((project) => {
            const canAffordOps = ops >= project.costOps;
            const canAffordFunds = project.costFunds === undefined || funds >= project.costFunds;
            const canAffordCreativity = project.costCreativity === undefined || creativity >= project.costCreativity;
            
            const canAfford = canAffordOps && canAffordFunds && canAffordCreativity;

            return (
              <div key={project.id} className="panel-inner flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-evolve-textMain">{project.title}</span>
                  <button
                    className="btn-evolve text-xs py-1 px-3 border-evolve-success text-evolve-success hover:bg-evolve-success/20 disabled:border-evolve-border disabled:text-evolve-textDim"
                    onClick={() => completeProject(project.id)}
                    disabled={!canAfford}
                  >
                    研发 (Research)
                  </button>
                </div>
                <p className="text-xs text-evolve-textDim leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 mt-1 text-xs font-mono">
                  {project.costOps > 0 && (
                    <span className={canAffordOps ? 'text-evolve-textMain' : 'text-evolve-danger'}>
                      成本: {project.costOps} Ops
                    </span>
                  )}
                  {project.costFunds && (
                    <span className={canAffordFunds ? 'text-evolve-textMain' : 'text-evolve-danger'}>
                      ${project.costFunds.toFixed(2)}
                    </span>
                  )}
                  {project.costCreativity && (
                    <span className={canAffordCreativity ? 'text-evolve-accent' : 'text-evolve-danger'}>
                      Creativity: {project.costCreativity}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-evolve-textDim italic py-4">
            等待新发现... (Awaiting new discoveries...)
          </div>
        )}

        {/* 已完成项目记录 */}
        {recentCompleted.length > 0 && (
          <div className="mt-4 border-t border-evolve-border pt-4">
            <h3 className="text-xs text-evolve-textDim uppercase tracking-wider mb-2">已完成 (Completed)</h3>
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
