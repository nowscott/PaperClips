import { useRef, useCallback, useEffect } from 'react';

export function useContinuousClick(callback: () => void, delay = 50, startDelay = 400) {
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    // 立即执行一次
    callbackRef.current();
    
    // 设置长按延迟后开始连发
    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        callbackRef.current();
      }, delay);
    }, startDelay);
  }, [delay, startDelay]);

  const stop = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 组件卸载时清理定时器
  useEffect(() => {
    return stop;
  }, [stop]);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      // 仅允许鼠标左键或触摸触发
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      start();
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onKeyDown: (e: React.KeyboardEvent) => {
      // 支持键盘的空格或回车（系统会自动处理按住不放的连发）
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callbackRef.current();
      }
    },
    onKeyUp: stop,
    onContextMenu: (e: React.SyntheticEvent) => {
      // 防止在移动端长按弹出右键菜单
      e.preventDefault();
    },
    style: { touchAction: 'none' } // 防止移动端长按滑动
  };
}