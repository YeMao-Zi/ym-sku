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
