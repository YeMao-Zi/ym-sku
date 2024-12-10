import { getPrime, PathFinder, arrayEqual } from "./skuUtil";
import { createSyncedProxy, deepClone, useDelay } from "./tools";
import type { Property, Sku, InitialValue, DataSource, Attribute, Data, Options } from "./type";

const useSku = <P extends Property, S extends Sku>(
  initialValue: InitialValue<P, S> | null,
  options: Options<P, S> = {}
) => {
  const { onChange } = options;

  const originData: DataSource<P, S> = {
    // 规格
    properties: [],
    selected: [], // 已经选中的规格
    unDisabled: [], // 可选规格
    skuList: [], // 可用sku
    valueInLabel: {}, // 质数，规格枚举值
    vertexList: [],
    sku: undefined,
    skuId: undefined,
  };

  let data = {
    properties: [],
    skuList: [],
    selected: [],
    skuId: undefined,
    sku: undefined,
  } as DataSource<P, S> & {
    properties: Property[];
  };

  const dataSource = createSyncedProxy(originData, data);

  let pathFinder: PathFinder;

  const selectAttribute = (propertyIndex: number, attributeIndex: number): Attribute => {
    // 获取已经选中的规格,质数，规格枚举值,以及原本规格名称
    const { selected, valueInLabel, properties, skuList } = dataSource;
    // 检查此次选择是否在已选内容中
    const attribute = properties[propertyIndex]["attributes"][attributeIndex];
    if (attribute.isDisabled) return attribute;
    const type = attribute.value;
    const prime = Reflect.get(valueInLabel, type);
    const index = selected.indexOf(type);
    // 获取已经有的矩阵值
    const light = pathFinder.light;
    // 如果未选中则提供选中，如果选中移除
    try {
      if (index > -1) {
        pathFinder.remove(prime);
        selected.splice(index, 1);
      } else if (light[propertyIndex].includes(2)) {
        // 如果同规格中，有选中，则先移除选中，
        // 获取需要移除的同行规格
        const removeType = properties[propertyIndex]["attributes"].map((item) => item.value)[
          light[propertyIndex].indexOf(2)
        ];
        // 获取需要提出的同行规格质数
        const removePrime = Reflect.get(valueInLabel, removeType);
        // 移除
        pathFinder.remove(removePrime);
        selected.splice(selected.indexOf(removeType), 1);
        //移除同行后，添加当前选择规格
        pathFinder.add(prime);
        selected.push(type);
      } else {
        pathFinder.add(prime);
        selected.push(type);
      }
    } catch (error) {
      console.error(error);
    }

    dataSource.selected = selected;
    // 更新不可选规格
    dataSource.unDisabled = pathFinder.getWay().flat();

    dataSource.properties = properties.map((item) => {
      item.attributes.forEach((attribute) => {
        attribute.isDisabled = !dataSource.unDisabled.includes(
          Reflect.get(valueInLabel, attribute.value)
        );
        attribute.isActive = selected.includes(attribute.value);
      });
      return item;
    });

    const sku = skuList.find((item) => arrayEqual(item.attributes, dataSource.selected));
    if (sku) {
      dataSource.skuId = sku.id;
      dataSource.sku = sku;
    } else {
      dataSource.skuId = "";
      dataSource.sku = undefined;
    }
    onChange?.(data);
    return attribute;
  };

  const setOptions = (options: Partial<InitialValue<P, S>>) => {
    const {
      properties = dataSource.properties,
      skuList = dataSource.skuList,
      skuId = dataSource.skuId,
    } = options;
    // 抹平规格内容
    properties.forEach((prop) => {
      prop.attributes.forEach((attr) => {
        dataSource.vertexList.push(attr.value);
      });
    });
    // 通过抹平规格，获取规格对应质数
    const prime = getPrime(dataSource.vertexList.length);
    // 质数对应规格数 枚举值处理
    const valueInLabel: Record<string, number> = {};
    dataSource.vertexList.forEach((item, index) => {
      valueInLabel[item] = prime[index];
    });

    // 根据规格坐标，排序质数坐标
    const way = properties.map((i) => {
      return i.attributes.map((ii) => valueInLabel[ii.value]);
    });

    // 初始化规格展示内容
    pathFinder = new PathFinder(
      way,
      skuList.map((item) => {
        // 筛选可选的 SKU
        return item.attributes.map((ii) => valueInLabel[ii]);
      })
    );

    // 获取不可选规格内容
    let unDisabled = pathFinder.getWay().flat();

    const _properties = properties.map((item) => {
      item.attributes.forEach((attribute) => {
        const prime = Reflect.get(valueInLabel, attribute.value);
        try {
          if (attribute.isActive) {
            pathFinder.add(prime);
            dataSource.selected.push(attribute.value);
          } else {
            attribute.isActive = false;
          }
        } catch (error) {
          attribute.isActive = false;
          console.error(`selcted attribute conflict: ${attribute.value}`);
        }
        // 获取不可选规格内容
        unDisabled = pathFinder.getWay().flat();
        attribute.isDisabled = !unDisabled.includes(valueInLabel[attribute.value]);
      });
      return item;
    });

    dataSource.properties = _properties;
    dataSource.unDisabled = unDisabled;
    dataSource.valueInLabel = valueInLabel;
    dataSource.skuList = skuList;

    if (skuId) {
      dataSource.skuId = skuId;
      selectedAttrsBySkuId(skuId);
    }

    useDelay(() => onChange?.(data));
  };

  const selectedAttrsBySkuId = (skuId: string) => {
    const { properties, valueInLabel } = dataSource;
    const sku = dataSource.skuList.find((item) => item.id === skuId);
    dataSource.sku = sku;
    dataSource.selected = sku?.attributes ?? [];
    dataSource.selected.forEach((item) => pathFinder.add(valueInLabel[item]));
    dataSource.unDisabled = pathFinder.getWay().flat();
    dataSource.properties = properties.map((item) => {
      item.attributes.forEach((attribute) => {
        attribute.isDisabled = !dataSource.unDisabled.includes(
          Reflect.get(valueInLabel, attribute.value)
        );
        attribute.isActive = dataSource.selected.includes(attribute.value);
      });
      return item;
    });
  };

  // 获取未选中标签
  const unselectedName = () => {
    const names: string[] = [];
    dataSource.properties.forEach((prop) => {
      const hasLabel = prop.attributes.some((attr) => {
        return attr.isActive === true;
      });
      if (!hasLabel) {
        if (dataSource.skuId) {
          const selectedSort = dataSource.selected.slice().sort();
          const skuAttrbutesSort = dataSource.sku.attributes.slice().sort();
          if (JSON.stringify(selectedSort) !== JSON.stringify(skuAttrbutesSort)) {
            names.push(prop.name);
          }
        } else {
          names.push(prop.name);
        }
      }
    });
    return names;
  };

  initialValue && setOptions(deepClone(initialValue));

  return { data, selectAttribute, setOptions, unselectedName };
};

export { useSku };
