/* eslint-disable no-underscore-dangle */
/**
 * support two level array clone
 * @param {*} o
 * @returns
 */
function cloneTwo(o: number[][]) {
  const ret = [];
  for (let j = 0; j < o.length; j++) {
    const i = o[j];
    ret.push(i.slice ? i.slice() : i);
  }
  return ret;
}

/**
 * 准备质数
 * @param {Int} num 质数范围
 * @returns []
 */
export function getPrime(total: number) {
  // 从第一个质数2开始
  let i = 2;
  const arr = [];
  /**
   * 检查是否是质数
   * @param {Int} number
   * @returns
   */
  const isPrime = (number: number) => {
    for (let ii = 2; ii < number; ++ii) {
      if (number % ii === 0) {
        return false;
      }
    }
    return true;
  };
  // 循环判断，质数数量够完成返回
  for (i; arr.length < total; ++i) {
    if (isPrime(i)) {
      arr.push(i);
    }
  }
  // 返回需要的质数
  return arr;
}

/**
 * 数组数据是否相等
 * @param {arr1} Array 质数范围
 * @param {arr2} Array 质数范围
 * @returns []
 */
export function arrayEqual(arr1: any[], arr2: any[]) {
  if (JSON.stringify(arr1.sort()) == JSON.stringify(arr2.sort())) {
    return true;
  } else {
    return false;
  }
}

/**
 * @param {Array} maps 所有得质数集合，每个质数代表一个规格ID
 * @param {*} openWay 可用的 SKU 组合
 */
export class PathFinder {
  maps: number[][];
  openWay: any[];
  private _way: any;
  light: any[];
  selected: any[];
  count: any;
  constructor(maps: number[][], openWay: any[]) {
    this.maps = maps;
    this.openWay = openWay;
    this._way = {};
    this.light = [];
    this.selected = [];
    this.init();
  }

  /**
   * 初始化，格式需要对比数据，并进行初始化是否可选计算
   */
  init() {
    this.light = cloneTwo(this.maps);
    const light = this.light;

    // 默认每个规则都可以选中，即赋值为1
    for (let i = 0; i < light.length; i++) {
      const l = light[i];
      for (let j = 0; j < l.length; j++) {
        this._way[l[j]] = [i, j];
        l[j] = 1;
      }
    }

    // 得到每个可操作的 SKU 质数的集合
    for (let i = 0; i < this.openWay.length; i++) {
      // eslint-disable-next-line no-eval
      // this.openWay[i] = eval(this.openWay[i].join("*"));
      this.openWay[i] = this.openWay[i].reduce((c: number, n: number) => c * n);
    }
    // return 初始化得到规格位置，规格默认可选处理，可选 SKU 的规格对应的质数合集
    this._check();
  }

  /**
   * 选中结果处理
   * @param {Boolean} isAdd 是否新增状态
   * @returns
   */
  _check(isAdd?: boolean) {
    const light = this.light;
    const maps = this.maps;

    for (let i = 0; i < light.length; i++) {
      const li = light[i];
      const selected = this._getSelected(i);
      for (let j = 0; j < li.length; j++) {
        if (li[j] !== 2) {
          // 如果是加一个条件，只在是light值为1的点进行选择
          if (isAdd) {
            if (li[j]) {
              light[i][j] = this._checkItem(maps[i][j], selected);
              this.count++;
            }
          } else {
            light[i][j] = this._checkItem(maps[i][j], selected);
            this.count++;
          }
        }
      }
    }
    return this.light;
  }
  /**
   * 检查是否可选内容
   * @param {Int} item 当前规格质数
   * @param {Array} selected
   * @returns
   */
  _checkItem(item: number, selected: number) {
    // 拿到可以选择的 SKU 内容集合
    const openWay = this.openWay;
    const val = item * selected;
    // 拿到已经选中规格集合*此规格集合值
    // 可选 SKU 集合反除，查询是否可选
    for (let i = 0; i < openWay.length; i++) {
      this.count++;
      if (openWay[i] % val === 0) {
        return 1;
      }
    }
    return 0;
  }

  /**
   * 组合中已选内容，初始化后无内容
   * @param {Index} xpath
   * @returns
   */
  _getSelected(xpath: number) {
    const selected = this.selected;
    const _way = this._way;
    const retArr = [];
    let ret = 1;

    if (selected.length) {
      for (let j = 0; j < selected.length; j++) {
        const s = selected[j];
        // xpath表示同一行，当已经被选择的和当前检测的项目再同一行的时候
        // 需要忽略。
        // 必须选择了 [1, 2],检测的项目是[1, 3]，不可能存在[1, 2]和[1, 3]
        // 的组合，他们在同一行
        if (_way[s][0] !== xpath) {
          ret *= s;
          retArr.push(s);
        }
      }
    }

    return ret;
  }

  /** 选择可选规格后处理
   * @param {array} point [x, y]
   */
  add(point: number[] | number) {
    const points = point instanceof Array ? point : this._way[point];
    const val = this.maps[points[0]][points[1]];

    // 检查是否可选中
    if (!this.light[points[0]][points[1]]) {
      throw new Error("this point [" + points + "] is no availabe, place choose an other");
    }

    if (val in this.selected) return;

    const isAdd = this._dealChange(points);
    this.selected.push(val);
    this.light[points[0]][points[1]] = 2;
    this._check(!isAdd);
  }

  /**
   * 判断是否同行选中
   * @param {Array} point 选中内容坐标
   * @returns
   */
  _dealChange(point: any[]) {
    const selected = this.selected;
    // 遍历处理选中内容
    for (let i = 0; i < selected.length; i++) {
      // 获取刚刚选中内容的坐标，属于同一行内容
      const line = this._way[selected[i]];
      if (line[0] === point[0]) {
        this.light[line[0]][line[1]] = 1;
        selected.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  /**
   * 移除已选规格
   * @param {Array} point
   */
  remove(point: number | number[]) {
    const points = point instanceof Array ? point : this._way[point];
    const val = this.maps[points[0]][points[1]];
    if (!val) {
      return;
    }

    if (val) {
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i] === val) {
          const line = this._way[this.selected[i]];
          this.light[line[0]][line[1]] = 1;
          this.selected.splice(i, 1);
        }
      }

      this._check();
    }
  }
  /**
   * 获取当前可用数据
   * @returns []
   */
  getWay() {
    const light = this.light;
    const way = cloneTwo(light);
    for (let i = 0; i < light.length; i++) {
      const line = light[i];
      for (let j = 0; j < line.length; j++) {
        if (line[j]) way[i][j] = this.maps[i][j];
      }
    }
    return way;
  }
}
