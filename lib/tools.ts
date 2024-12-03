export function createSyncedProxy<T extends Object>(target: T, syncTarget: Object) {
  return new Proxy(target, {
    set(obj, prop, value) {
      // 当在代理对象上设置属性时，也更新同步对象的属性
      if (Reflect.has(syncTarget, prop)) {
        syncTarget[prop] = value;
      }
      return Reflect.set(obj, prop, value);
    },
    get(obj, prop, receiver) {
      return Reflect.get(obj, prop, receiver);
    },
  });
}

export const deepClone = (obj: any) => {
  if (typeof obj !== "object") {
    return obj;
  }
  let objClone = new obj.constructor(); //使用构造器,是对象输出{}，是数组输出[],是基本数据类型就输出原始数据。
  for (const key in obj) {
    // 深层拷贝，如果还有结构调用自身实现递归
    objClone[key] = deepClone(obj[key]);
  }
  //基本类型直接赋值
  return objClone;
};

export function useDelay(fn: Function, delay = 0) {
  return setTimeout(() => {
    fn();
  }, delay);
}
