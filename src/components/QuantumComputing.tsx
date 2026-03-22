import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useContinuousClick } from '../hooks/useContinuousClick';

export const QuantumComputing = () => {
  const { qChips, qComputingUnlocked, addOps } = useGameStore();
  const [qValues, setQValues] = useState<number[]>([]);
  const [totalQ, setTotalQ] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const now = Date.now();
      const newValues = [];
      let sum = 0;

      // 为每个量子芯片生成波动的正弦值
      for (let i = 0; i < qChips; i++) {
        // 让每个芯片的频率和相位略有不同，制造混沌感
        const speed = 0.001 + (i * 0.0002);
        const phase = i * Math.PI / 3;
        const val = Math.sin(now * speed + phase);
        newValues.push(val);
        sum += val;
      }

      setQValues(newValues);
      setTotalQ(sum);

      animationFrameId = requestAnimationFrame(animate);
    };

    if (qChips > 0) {
      animate();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [qChips]);

  const handleCompute = () => {
    // 根据当前的总量子状态计算算力 (放大倍数可调)
    // 这里的 totalQ 会随动画帧实时更新，callbackRef.current() 每次执行时都会读取最新的 totalQ
    const opsGained = Math.floor(totalQ * 360);
    if (opsGained > 0) {
      addOps(opsGained);
    }
  };

  const continuousCompute = useContinuousClick(handleCompute, 50, 400);

  // 如果没有解锁量子计算，不显示面板
  if (!qComputingUnlocked) return null;

  return (
    <div className="panel flex flex-col gap-4 border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.05)]">
      <div className="flex flex-col gap-4">
        {/* 量子波动显示区 */}
        <div className="panel-inner flex justify-center gap-2 h-20 items-center overflow-hidden relative bg-black/5">
          {/* 添加一条中间基准线 */}
          <div className="absolute left-0 right-0 h-px bg-evolve-textDim/20 top-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          {qValues.map((val, index) => {
            const isPositive = val > 0;
            const opacity = isNaN(val) ? 0 : Math.min(1, Math.max(0, Math.abs(val)));
            
            // 使用纯 CSS 变量配合 scaleY 制作动态柱状图效果
            return (
              <div 
                key={index}
                className="relative flex flex-col items-center justify-center w-8 h-full"
              >
                {/* 上半部分 (正值波峰) */}
                <div className="absolute bottom-1/2 w-6 bg-evolve-success rounded-t-sm transition-all duration-75 origin-bottom"
                     style={{ 
                       height: '40%', 
                       transform: `scaleY(${isPositive ? opacity : 0})`,
                       boxShadow: isPositive ? `0 0 ${opacity * 10}px rgba(46, 204, 113, 0.5)` : 'none'
                     }}
                ></div>
                
                {/* 下半部分 (负值波谷) */}
                <div className="absolute top-1/2 w-6 bg-evolve-danger rounded-b-sm transition-all duration-75 origin-top"
                     style={{ 
                       height: '40%', 
                       transform: `scaleY(${!isPositive ? opacity : 0})`,
                       boxShadow: !isPositive ? `0 0 ${opacity * 10}px rgba(231, 76, 60, 0.5)` : 'none'
                     }}
                ></div>

                {/* 数值悬浮显示 (保持微弱的可见度，增强科技感) */}
                <span className="absolute z-10 text-[9px] font-mono font-bold text-evolve-textMain/70 mix-blend-difference pointer-events-none">
                  {isNaN(val) ? '0.00' : Math.abs(val).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* 算力收集按钮 */}
        <button
          className="btn-evolve btn-evolve-accent py-2 font-bold tracking-wider select-none touch-none"
          {...continuousCompute}
          disabled={totalQ <= 0}
        >
          执行量子计算
          {totalQ > 0 && <span className="ml-2 opacity-80">+{Math.floor(totalQ * 360)} 算力</span>}
        </button>
      </div>
    </div>
  );
};