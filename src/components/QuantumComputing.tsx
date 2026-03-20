import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Cpu } from 'lucide-react';

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
    const opsGained = Math.floor(totalQ * 360);
    if (opsGained > 0) {
      addOps(opsGained);
    }
  };

  // 如果没有解锁量子计算，不显示面板
  if (!qComputingUnlocked) return null;

  return (
    <div className="panel flex flex-col gap-4 border-evolve-accent/30 shadow-[0_0_15px_rgba(0,168,255,0.05)]">
      <div className="flex items-center gap-2 border-b border-evolve-border pb-2">
        <Cpu className="w-5 h-5 text-evolve-accent" />
        <h2 className="text-lg font-bold tracking-wide uppercase text-evolve-accent">
          量子计算 <span className="text-sm opacity-50 font-normal">Quantum Computing</span>
        </h2>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {/* 量子波动显示区 */}
        <div className="panel-inner flex justify-center gap-2 h-16 items-center overflow-hidden">
          {qValues.map((val, index) => {
            // 根据正负值决定颜色，并用透明度表现强度
            const isPositive = val > 0;
            // 确保透明度在 0-1 之间，并且处理可能的 NaN
            const opacity = isNaN(val) ? 0 : Math.min(1, Math.max(0, Math.abs(val)));
            const bgColor = isPositive ? `rgba(46, 204, 113, ${opacity})` : `rgba(231, 76, 60, ${opacity})`;
            
            return (
              <div 
                key={index}
                className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold border border-evolve-border rounded"
                style={{ backgroundColor: bgColor }}
              >
                {isNaN(val) ? '0.00' : Math.abs(val).toFixed(2)}
              </div>
            );
          })}
        </div>

        {/* 算力收集按钮 */}
        <button
          className="btn-evolve btn-evolve-accent py-2 font-bold tracking-wider"
          onClick={handleCompute}
          disabled={totalQ <= 0}
        >
          计算 (Compute) 
          {totalQ > 0 && <span className="ml-2 opacity-80">+{Math.floor(totalQ * 360)} Ops</span>}
        </button>
      </div>
    </div>
  );
};