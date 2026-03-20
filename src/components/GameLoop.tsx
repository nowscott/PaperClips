import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const GameLoop = () => {
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 100); // 每 100ms 触发一次

    return () => clearInterval(interval);
  }, [tick]);

  return null; // 不需要渲染任何内容
};
