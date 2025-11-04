/* eslint-disable no-underscore-dangle */

/**
 * 克隆二维数组（浅拷贝）
 */
function cloneTwo(o: number[][]): number[][] {
  return o.map((item) => (Array.isArray(item) ? [...item] : item));
}

/**
 * 使用埃拉托斯特尼筛法生成质数（更高效的算法）
 * @param total 需要的质数数量
 * @returns 质数数组
 */
export function getPrime(total: number): number[] {
  if (total <= 0) return [];
  if (total === 1) return [2];

  // 估算需要检查的范围（使用素数定理近似值）
  const maxNumber = Math.max(20, Math.ceil(total * Math.log(total) * 1.5));
  const primes: number[] = [];
  const isPrime = new Array(maxNumber + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  // 埃拉托斯特尼筛法
  for (let i = 2; i <= maxNumber && primes.length < total; i++) {
    if (isPrime[i]) {
      primes.push(i);
      // 标记所有 i 的倍数为非质数
      for (let j = i * i; j <= maxNumber; j += i) {
        isPrime[j] = false;
      }
    }
  }

  // 如果筛法生成的质数不够，继续用传统方法查找
  if (primes.length < total) {
    let num = maxNumber + 1;
    while (primes.length < total) {
      if (isPrimeNumber(num)) {
        primes.push(num);
      }
      num++;
    }
  }

  return primes;
}

/**
 * 检查单个数字是否为质数
 */
function isPrimeNumber(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const sqrt = Math.sqrt(n);
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * 判断两个数组是否相等（元素相同，不考虑顺序）
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @returns 是否相等
 */
export function arrayEqual(arr1: any[], arr2: any[]): boolean {
  // 先检查长度避免不必要的排序
  if (arr1.length !== arr2.length) {
    return false;
  }

  // 如果长度为 0，直接返回 true
  if (arr1.length === 0) {
    return true;
  }

  // 对于小数组，使用排序比较
  // 对于大数组，可以考虑使用 Map 计数（但当前场景数组不会太大）
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  // 逐个比较已排序的元素
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

/**
 * 路径查找器，用于处理 SKU 组合的选择逻辑
 * 使用质数算法来快速判断 SKU 组合是否可用
 */
export class PathFinder {
  /** 所有规格的质数集合，每个质数代表一个规格属性 */
  maps: number[][];
  /** 可用 SKU 组合的质数乘积数组 */
  openWay: number[];
  /** 质数到坐标的映射 [行索引, 列索引] */
  private _way: Record<number, [number, number]>;
  /** 规格状态矩阵：0-不可选，1-可选，2-已选中 */
  light: number[][];
  /** 已选中的质数数组 */
  selected: number[];
  /** 操作计数器（用于性能统计） */
  count: number;

  constructor(maps: number[][], openWay: number[][]) {
    this.maps = maps;
    // 计算每个 SKU 组合的质数乘积
    this.openWay = openWay.map((combo) =>
      combo.reduce((acc, val) => acc * val, 1)
    );
    this._way = {};
    this.light = [];
    this.selected = [];
    this.count = 0;
    this.init();
  }

  /**
   * 初始化规格状态矩阵和坐标映射
   */
  init(): void {
    this.light = cloneTwo(this.maps);
    const light = this.light;

    // 初始化：构建质数到坐标的映射，并设置所有规格为可选状态（1）
    for (let i = 0; i < light.length; i++) {
      const row = light[i];
      for (let j = 0; j < row.length; j++) {
        const prime = this.maps[i][j];
        this._way[prime] = [i, j];
        row[j] = 1; // 1 表示可选
      }
    }

    // 检查并更新所有规格的可选状态
    this._check();
  }

  /**
   * 检查并更新所有规格的可选状态
   * @param isAdd 是否在添加模式下（只检查当前可选的状态）
   * @returns 更新后的状态矩阵
   */
  _check(isAdd?: boolean): number[][] {
    // 重置计数器
    this.count = 0;

    const light = this.light;
    const maps = this.maps;

    for (let i = 0; i < light.length; i++) {
      const row = light[i];
      // 获取当前行已选中的其他规格的乘积
      const selected = this._getSelected(i);

      for (let j = 0; j < row.length; j++) {
        // 跳过已选中的规格（值为 2）
        if (row[j] === 2) continue;

        // 如果是添加模式，只检查当前可选的状态（值为 1）
        if (isAdd && !row[j]) {
          continue;
        }

        // 检查当前规格是否可选
        row[j] = this._checkItem(maps[i][j], selected);
        this.count++;
      }
    }

    return this.light;
  }
  /**
   * 检查指定规格是否可选
   * @param item 当前规格的质数
   * @param selected 其他已选中规格的质数乘积
   * @returns 1-可选，0-不可选
   */
  _checkItem(item: number, selected: number): number {
    // 计算当前规格与已选规格的组合值
    const combination = item * selected;

    // 检查是否存在可用的 SKU 组合包含此规格组合
    // 如果某个 SKU 的质数乘积能被组合值整除，说明可选
    for (let i = 0; i < this.openWay.length; i++) {
      this.count++;
      if (this.openWay[i] % combination === 0) {
        return 1; // 可选
      }
    }

    return 0; // 不可选
  }

  /**
   * 获取指定行已选中的其他规格的质数乘积
   * @param xpath 当前行的索引
   * @returns 其他行已选中规格的质数乘积
   */
  _getSelected(xpath: number): number {
    if (this.selected.length === 0) {
      return 1;
    }

    let product = 1;

    for (const prime of this.selected) {
      // 排除同一行的已选规格（同一行只能选一个）
      // 例如：如果选择了颜色-红色，检查颜色-蓝色时，需要排除红色
      if (this._way[prime][0] !== xpath) {
        product *= prime;
      }
    }

    return product;
  }

  /**
   * 添加选中规格
   * @param point 规格坐标 [行, 列] 或质数值
   */
  add(point: number[] | number): void {
    const points: [number, number] =
      Array.isArray(point) ? (point as [number, number]) : this._way[point];
    const prime = this.maps[points[0]][points[1]];

    // 检查是否可选
    if (!this.light[points[0]][points[1]]) {
      throw new Error(
        `规格 [${points[0]}, ${points[1]}] 不可选，请选择其他规格`
      );
    }

    // 检查是否已选中
    if (this.selected.includes(prime)) {
      return;
    }

    // 处理同行已选规格的替换
    const isAdd = this._dealChange(points);

    // 添加到已选列表并更新状态
    this.selected.push(prime);
    this.light[points[0]][points[1]] = 2; // 2 表示已选中

    // 重新检查所有规格状态（如果替换了同行规格，需要全量检查）
    this._check(!isAdd);
  }

  /**
   * 处理同行规格替换逻辑
   * @param point 新选中的规格坐标
   * @returns 是否发生了替换（true-替换，false-新增）
   */
  _dealChange(point: [number, number]): boolean {
    const rowIndex = point[0];

    // 查找同一行是否已有选中的规格
    const selectedIndex = this.selected.findIndex(
      (prime) => this._way[prime][0] === rowIndex
    );

    if (selectedIndex !== -1) {
      // 存在同行已选规格，需要先移除
      const oldPrime = this.selected[selectedIndex];
      const oldPosition = this._way[oldPrime];

      // 恢复旧规格的状态为可选
      this.light[oldPosition[0]][oldPosition[1]] = 1;
      // 从已选列表中移除
      this.selected.splice(selectedIndex, 1);

      return true; // 发生了替换
    }

    return false; // 没有替换，是新增
  }

  /**
   * 移除已选规格
   * @param point 规格坐标 [行, 列] 或质数值
   */
  remove(point: number | number[]): void {
    const points: [number, number] =
      Array.isArray(point) ? (point as [number, number]) : this._way[point];
    const prime = this.maps[points[0]][points[1]];

    // 查找并移除选中的项
    const selectedIndex = this.selected.indexOf(prime);
    if (selectedIndex !== -1) {
      const position = this._way[prime];

      // 恢复状态为可选
      this.light[position[0]][position[1]] = 1;
      // 从已选列表中移除
      this.selected.splice(selectedIndex, 1);

      // 重新检查所有规格状态
      this._check();
    }
  }
  /**
   * 获取当前可用的规格质数矩阵
   * @returns 可用规格的质数矩阵（不可用的位置为 0）
   */
  getWay(): number[][] {
    const way = cloneTwo(this.light);

    for (let i = 0; i < this.light.length; i++) {
      const row = this.light[i];
      for (let j = 0; j < row.length; j++) {
        // 如果状态为可选（1）或已选中（2），返回对应的质数
        if (row[j]) {
          way[i][j] = this.maps[i][j];
        }
      }
    }

    return way;
  }
}