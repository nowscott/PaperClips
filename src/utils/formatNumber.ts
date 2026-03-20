/**
 * 格式化游戏中的大数字
 * 
 * 规则：
 * - 小于 1,000,000 的数字：使用标准的千分位逗号分隔 (如 999,999)
 * - 1,000,000 到 1,000,000,000 之间：显示为百万 (M) 或十亿 (B)
 * - 大于 1,000,000,000 (10亿) 的数字：如果太大则转换为科学计数法 (如 1.23e+15)
 * - 对于小数：保留指定位数的小数
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  if (isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  // 1. 小于 100万 的数字，直接使用千分位
  if (absNum < 1_000_000) {
    // 处理带小数的情况（如资金）
    if (decimals > 0) {
      return num.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      });
    }
    // 处理纯整数（如回形针数量）
    return Math.floor(num).toLocaleString();
  }

  // 2. 100万 到 10亿 之间，使用 M (Million) 后缀
  if (absNum < 1_000_000_000) {
    return sign + (absNum / 1_000_000).toFixed(2) + ' M';
  }

  // 3. 10亿 到 1万亿 之间，使用 B (Billion) 后缀
  if (absNum < 1_000_000_000_000) {
    return sign + (absNum / 1_000_000_000).toFixed(2) + ' B';
  }
  
  // 4. 1万亿 到 1000万亿 之间，使用 T (Trillion) 后缀
  if (absNum < 1_000_000_000_000_000) {
    return sign + (absNum / 1_000_000_000_000).toFixed(2) + ' T';
  }

  // 5. 超过 1000万亿 (1e15)，使用标准的科学计数法 (如 3.14e+20)
  // toExponential(2) 会返回如 "3.14e+20" 的格式
  return sign + absNum.toExponential(2).replace('+', '');
};
