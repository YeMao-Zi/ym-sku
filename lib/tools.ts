/**
 * 创建同步代理对象，当设置属性时自动同步到目标对象
 */
export function createSyncedProxy<T extends Record<string, any>>(
  target: T,
  syncTarget: Record<string, any>
): T {
  return new Proxy(target, {
    set(obj, prop: string | symbol, value: any) {
      const propKey = String(prop);
      // 当在代理对象上设置属性时，也更新同步对象的属性
      if (propKey in syncTarget) {
        syncTarget[propKey] = value;
      }
      return Reflect.set(obj, prop, value);
    },
    get(obj, prop: string | symbol, receiver: any) {
      return Reflect.get(obj, prop, receiver);
    },
  });
}

/**
 * 深度克隆对象，支持常见数据类型
 */
export function deepClone<T>(obj: T): T {
  // 处理 null 和 undefined
  if (obj == null || typeof obj !== "object") {
    return obj;
  }

  // 处理 Date 对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  // 处理 RegExp 对象
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as T;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  // 处理普通对象
  const objClone = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objClone[key] = deepClone(obj[key]);
    }
  }

  return objClone;
}

/**
 * 延迟执行函数
 */
export function useDelay(fn: () => void, delay = 0): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    fn();
  }, delay);
}
