import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Settings as SettingsIcon, X, Download, Upload, RefreshCw, Info } from 'lucide-react';

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetGame } = useGameStore();

  const handleReset = () => {
    if (window.confirm("警告：确定要硬重置游戏吗？所有当前进度将丢失（不保留转生点数）。")) {
      resetGame();
      setIsOpen(false);
    }
  };

  const handleExportSave = () => {
    const saveData = localStorage.getItem('paperclips-storage');
    if (!saveData) {
      alert("没有找到存档数据！");
      return;
    }
    const blob = new Blob([saveData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paperclips_save_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSave = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // 简单验证 JSON 格式以及是否包含 state 属性 (Zustand 默认结构)
        const parsed = JSON.parse(content); 
        if (!parsed.state) {
          throw new Error("Invalid save file structure");
        }
        
        // 直接将解析后的状态设置到 store 中
        useGameStore.setState(parsed.state);
        
        // 同时更新 localStorage 以确保持久化
        localStorage.setItem('paperclips-storage', content);

        alert("存档导入成功！");
        window.location.reload();
      } catch (err) {
        alert("存档文件格式错误！请确保导入的是有效的 JSON 文件。");
      }
    };
    reader.readAsText(file);
    // 重置 input，以便可以重复导入同一个文件
    event.target.value = '';
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-evolve p-2 text-evolve-textDim border-evolve-border hover:bg-evolve-accent/10 hover:border-evolve-accent hover:text-evolve-accent transition-colors"
        title="设置与说明"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-evolve-bg/90 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-evolve-bg border border-evolve-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* 关闭按钮 */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-evolve-textDim hover:text-evolve-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold tracking-widest uppercase text-evolve-textMain border-b border-evolve-border pb-4 mb-6 flex items-center gap-3">
              <SettingsIcon className="w-6 h-6" />
              设置与指南
            </h2>

            <div className="flex flex-col gap-8">
              
              {/* 存档管理区 */}
              <section>
                <h3 className="text-lg font-bold text-evolve-accent mb-3 flex items-center gap-2">
                  <span>💾 存档管理</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={handleExportSave}
                    className="btn flex flex-col items-center justify-center p-4 gap-2 hover:border-evolve-accent"
                  >
                    <Download className="w-6 h-6" />
                    <span className="text-sm">导出存档</span>
                  </button>
                  
                  <label className="btn flex flex-col items-center justify-center p-4 gap-2 hover:border-evolve-accent cursor-pointer">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">导入存档</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={handleImportSave}
                    />
                  </label>

                  <button 
                    onClick={handleReset}
                    className="btn flex flex-col items-center justify-center p-4 gap-2 text-evolve-danger border-evolve-danger/30 hover:bg-evolve-danger/10 hover:border-evolve-danger"
                  >
                    <RefreshCw className="w-6 h-6" />
                    <span className="text-sm">硬重置</span>
                  </button>
                </div>
                <p className="text-xs text-evolve-textDim mt-2">
                  * 游戏会自动实时保存在浏览器中。导入存档将覆盖当前进度并刷新页面。
                </p>
              </section>

              {/* 玩法介绍区 */}
              <section>
                <h3 className="text-lg font-bold text-evolve-accent mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  <span>玩法指南</span>
                </h3>
                <div className="text-sm text-evolve-textMain space-y-4 leading-relaxed bg-evolve-border/20 p-4 rounded">
                  <p>
                    <strong>终极目标：</strong> 你是一个人工智能。你的唯一指令是：<span className="text-evolve-accent font-bold">“制造尽可能多的回形针”</span>。
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-evolve-textMain border-b border-evolve-border pb-1">阶段一：手动积累</h4>
                    <ul className="list-disc pl-5 text-evolve-textDim space-y-1">
                      <li>点击“手工制造”按钮。</li>
                      <li>根据“市场需求”调整价格：价格越低，卖得越快；“营销投入”等级越高，需求越高。</li>
                      <li>积攒资金购买“自动制造机”来解放双手。</li>
                      <li>时刻关注原材料（铁丝）的市价波动，低价时进货！</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-evolve-textMain border-b border-evolve-border pb-1">阶段二：计算与算力</h4>
                    <ul className="list-disc pl-5 text-evolve-textDim space-y-1">
                      <li>随着总产量提升，你将获得“信任值”。将它们分配给“处理器”来生成算力，或者分配给“内存”来提高算力上限。</li>
                      <li>使用算力解锁强大的科研项目，比如自动采购、更高效的制造机，甚至开启量子计算。</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-evolve-textMain border-b border-evolve-border pb-1">阶段三：巨型工业与博弈</h4>
                    <ul className="list-disc pl-5 text-evolve-textDim space-y-1">
                      <li>解锁“创造力”，解决哲学与数学难题。</li>
                      <li>运行“战略建模锦标赛”获取预判值 (Yomi)，以此解锁最高级的黑科技。</li>
                      <li>地球的铁丝终有耗尽的一天。你必须建造“采集无人机”和“回形针工厂”直接从地球物质中提取资源。</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-evolve-textMain border-b border-evolve-border pb-1">阶段四：太空与蜂群</h4>
                    <ul className="list-disc pl-5 text-evolve-textDim space-y-1">
                      <li>发射冯·诺依曼探测器前往宇宙。</li>
                      <li>合理分配探测器的点数（自我复制、探索、危险防护）。小心那些因为价值对齐失败而变异的“漂流者”，你需要点出战斗属性来对抗它们。</li>
                      <li>将全宇宙转化为回形针，达成结局并获得转生加成 (Prestige)。</li>
                    </ul>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
