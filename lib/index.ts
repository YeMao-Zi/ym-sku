import { getPrime, PathFinder, arrayEqual } from "./skuUtil";
import { createSyncedProxy, deepClone, useDelay } from "./tools";
import type {
  Property,
  Sku,
  InitialValue,
  DataSource,
  Attribute,
  Data,
  Options,
} from "./type";

/**
 * SKU 选择处理 Hook
 * @param initialValue 初始值
 * @param options 配置选项
 * @returns SKU 处理工具对象
 */
const useSku = <P extends Property, S extends Sku>(
  initialValue: InitialValue<P, S> | null,
  options: Options<P, S> = {}
) => {
  const { onChange } = options;

  // 原始数据源
  const dataSource: DataSource<P, S> = {
    properties: [],
    selected: [], // 已选中的规格值数组
    unDisabled: [], // 可选的规格质数数组
    skuList: [], // 可用 SKU 列表
    valueInLabel: {}, // 规格值到质数的映射
    vertexList: [], // 所有规格值的扁平数组
    sku: undefined,
    skuId: undefined,
  };

  // 同步数据对象（用于外部访问）
  const data = {
    properties: [],
    skuList: [],
    selected: [],
    skuId: undefined,
    sku: undefined,
  } as DataSource<P, S> & {
    properties: Property[];
  };

  // 创建同步代理
  createSyncedProxy(dataSource, data);

  // 路径查找器实例
  let pathFinder: PathFinder;

  /**
   * 更新所有属性的状态（是否可选、是否激活）
   */
  const updatePropertiesState = (): void => {
    const { properties, valueInLabel, unDisabled, selected } = dataSource;

    dataSource.properties = properties.map((property) => {
      property.attributes.forEach((attribute) => {
        const prime = valueInLabel[attribute.value];
        attribute.isDisabled = !unDisabled.includes(prime);
        attribute.isActive = selected.includes(attribute.value);
      });
      return property;
    });
  };

  /**
   * 根据已选规格更新对应的 SKU 信息
   */
  const updateSkuInfo = (): void => {
    const { skuList, selected } = dataSource;

    if (selected.length === 0) {
      dataSource.skuId = "";
      dataSource.sku = undefined;
      return;
    }

    const matchedSku = skuList.find((sku) =>
      arrayEqual(sku.attributes, selected)
    );

    if (matchedSku) {
      dataSource.skuId = matchedSku.id;
      dataSource.sku = matchedSku;
    } else {
      dataSource.skuId = "";
      dataSource.sku = undefined;
    }
  };

  /**
   * 更新不可选规格列表
   */
  const updateUnDisabled = (): void => {
    dataSource.unDisabled = pathFinder.getWay().flat();
  };

  /**
   * 触发变更回调
   */
  const triggerChange = (): void => {
    onChange?.(data);
  };

  /**
   * 选择/取消选择规格属性
   * @param propertyIndex 规格索引
   * @param attributeIndex 属性索引
   * @returns 被操作的属性对象
   */
  const selectAttribute = (
    propertyIndex: number,
    attributeIndex: number
  ): Attribute => {
    const { selected, valueInLabel, properties } = dataSource;
    const attribute = properties[propertyIndex]?.attributes[attributeIndex];

    // 参数验证
    if (!attribute) {
      console.warn(
        `Invalid attribute index: propertyIndex=${propertyIndex}, attributeIndex=${attributeIndex}`
      );
      return properties[propertyIndex]?.attributes[0] || ({} as Attribute);
    }

    // 如果属性已禁用，直接返回
    if (attribute.isDisabled) {
      return attribute;
    }

    // 保护 pathFinder 未初始化的情况
    if (!pathFinder) {
      console.error(
        "pathFinder is not initialized, so properties cannot be selected. Please call setOptions to initialize it first."
      );
      return attribute;
    }

    const attributeValue = attribute.value;
    const prime = valueInLabel[attributeValue];
    const selectedIndex = selected.indexOf(attributeValue);
    const light = pathFinder.light;
    const hasSelectedInSameProperty =
      Array.isArray(light[propertyIndex]) && light[propertyIndex].includes(2);

    try {
      // 情况1: 如果已选中，则取消选择
      if (selectedIndex > -1) {
        pathFinder.remove(prime);
        selected.splice(selectedIndex, 1);
      }
      // 情况2: 如果同规格中已有选中项，先移除旧的选择，再添加新的
      else if (hasSelectedInSameProperty) {
        const selectedPrimeIndex = (light[propertyIndex] as number[]).indexOf(
          2
        );
        const selectedAttributeValue =
          properties[propertyIndex].attributes[selectedPrimeIndex].value;
        const selectedPrime = valueInLabel[selectedAttributeValue];

        pathFinder.remove(selectedPrime);
        selected.splice(selected.indexOf(selectedAttributeValue), 1);

        pathFinder.add(prime);
        selected.push(attributeValue);
      }
      // 情况3: 直接添加新选择
      else {
        pathFinder.add(prime);
        selected.push(attributeValue);
      }

      // 更新选中数组（只做一次浅拷贝）
      dataSource.selected = selected.slice();

      // 更新不可选规格列表
      updateUnDisabled();

      // 更新属性状态
      updatePropertiesState();

      // 更新 SKU 信息
      updateSkuInfo();

      // 触发变更回调
      triggerChange();
    } catch (error) {
      console.error("Error occurred while processing the data:", error);
      return attribute;
    }

    return attribute;
  };

  /**
   * 构建规格值到质数的映射
   */
  const buildValueInLabel = (properties: P[]): Record<string, number> => {
    // 收集所有规格值
    const vertexList: any[] = [];
    properties.forEach((prop) => {
      prop.attributes.forEach((attr) => {
        vertexList.push(attr.value);
      });
    });

    // 校验唯一性，避免不同属性值冲突覆盖
    const seen = new Set<string>();
    for (const v of vertexList) {
      if (seen.has(v)) {
        console.warn(
          `Found duplicate attribute value "${v}", it is recommended to ensure each attribute value is unique to avoid mapping conflicts.`
        );
        break;
      }
      seen.add(v);
    }

    // 生成对应数量的质数
    const primes = getPrime(vertexList.length);

    // 构建映射关系
    const valueInLabel: Record<string, number> = {};
    vertexList.forEach((value, index) => {
      valueInLabel[value] = primes[index];
    });

    return valueInLabel;
  };

  /**
   * 构建规格质数矩阵
   */
  const buildPrimeMatrix = (
    properties: P[],
    valueInLabel: Record<string, number>
  ): number[][] => {
    return properties.map((property) =>
      property.attributes.map((attr) => valueInLabel[attr.value])
    );
  };

  /**
   * 构建 SKU 质数组合数组
   */
  const buildSkuPrimeCombinations = (
    skuList: S[],
    valueInLabel: Record<string, number>
  ): number[][] => {
    return skuList.map((sku) =>
      sku.attributes.map((attrValue) => valueInLabel[attrValue])
    );
  };

  /**
   * 初始化属性状态（处理预选中的属性）
   */
  const initializePropertiesState = (
    properties: P[],
    valueInLabel: Record<string, number>
  ): P[] => {
    // 先尝试将所有预选 prime 加入 pathFinder（若添加失败则回退对应属性）
    const toUpdate: { attribute: Attribute; prime?: number }[] = [];

    for (const property of properties) {
      for (const attribute of property.attributes) {
        const prime = valueInLabel[attribute.value];
        const wasActive = attribute.isActive === true;

        if (wasActive) {
          toUpdate.push({ attribute, prime });
        } else {
          attribute.isActive = false;
        }
      }
    }

    // 保护 pathFinder 未初始化的情况
    if (!pathFinder) {
      throw new Error("pathFinder is not initialized, so pre-selected attributes cannot be processed.");
    }

    // 批量尝试加入已预选的 prime（避免在每次加入后重复计算 unDisabled）
    for (const item of toUpdate) {
      try {
        if (item.prime !== undefined) {
          pathFinder.add(item.prime);
          if (!dataSource.selected.includes(item.attribute.value)) {
            dataSource.selected.push(item.attribute.value);
          }
        }
      } catch (error) {
        // 如果预选中的属性冲突，重置为未选中
        item.attribute.isActive = false;
        console.warn(
          `Found conflict in pre-selected attribute, reset: ${item.attribute.value}`,
          error
        );
      }
    }

    // 批量更新不可选列表（只调用一次）
    updateUnDisabled();

    // 根据最终的 unDisabled 更新每个属性的 isDisabled 状态
    for (const property of properties) {
      for (const attribute of property.attributes) {
        const prime = valueInLabel[attribute.value];
        attribute.isDisabled = !dataSource.unDisabled.includes(prime);
      }
    }

    return properties;
  };

  /**
   * 设置 SKU 选项
   * @param options 配置选项
   */
  const setOptions = (options: Partial<InitialValue<P, S>>): void => {
    const {
      properties = dataSource.properties,
      skuList = dataSource.skuList,
      skuId = dataSource.skuId,
    } = options;

    // 重置选中状态
    dataSource.selected = [];

    // 构建规格值到质数的映射
    const valueInLabel = buildValueInLabel(properties);
    dataSource.valueInLabel = valueInLabel;

    // 构建规格质数矩阵
    const primeMatrix = buildPrimeMatrix(properties, valueInLabel);

    // 构建 SKU 质数组合数组
    const skuPrimeCombinations = buildSkuPrimeCombinations(
      skuList,
      valueInLabel
    );

    // 初始化路径查找器
    pathFinder = new PathFinder(primeMatrix, skuPrimeCombinations);

    // 初始化不可选规格列表
    updateUnDisabled();

    // 初始化属性状态（处理预选中的属性）
    const processedProperties = initializePropertiesState(
      properties,
      valueInLabel
    );
    // 更新数据源
    dataSource.properties = processedProperties;
    dataSource.skuList = skuList;

    // 如果指定了 skuId，根据 skuId 选择属性
    if (skuId) {
      dataSource.skuId = skuId;
      selectedAttrsBySkuId(skuId);
    } else {
      // 更新 SKU 信息
      updateSkuInfo();
    }

    // 延迟触发变更回调（避免在初始化时频繁触发）
    useDelay(() => triggerChange());
  };

  /**
   * 根据 SKU ID 选择对应的属性
   * @param skuId SKU ID
   */
  const selectedAttrsBySkuId = (skuId: string): void => {
    const { valueInLabel } = dataSource;
    const sku = dataSource.skuList.find((item) => item.id === skuId);

    if (!sku) {
      console.warn(`SKU with ID "${skuId}" not found.`);
      return;
    }

    // 重置选中状态
    dataSource.selected = [];
    pathFinder = new PathFinder(
      buildPrimeMatrix(dataSource.properties, valueInLabel),
      buildSkuPrimeCombinations(dataSource.skuList, valueInLabel)
    );

    // 设置 SKU 信息
    dataSource.sku = sku;
    dataSource.skuId = skuId;

    // 根据 SKU 的属性选择对应的规格
    sku.attributes.forEach((attrValue) => {
      const prime = valueInLabel[attrValue];
      if (prime) {
        try {
          pathFinder.add(prime);
          dataSource.selected.push(attrValue);
        } catch (error) {
          console.warn(
            `Error occurred while selecting attribute ${attrValue}:`,
            error
          );
        }
      }
    });

    // 更新不可选规格列表
    updateUnDisabled();

    // 更新属性状态
    updatePropertiesState();

    // 触发变更回调
    triggerChange();
  };

  /**
   * 获取未选中规格的名称列表
   * @returns 未选中的规格名称数组
   */
  const unselectedName = (): string[] => {
    const unselectedNames: string[] = [];

    dataSource.properties.forEach((property) => {
      // 检查该规格是否有选中的属性
      const hasSelectedAttribute = property.attributes.some(
        (attr) => attr.isActive === true
      );

      if (!hasSelectedAttribute) {
        // 如果有 SKU 且已选规格与 SKU 规格完全匹配，则不添加到未选中列表
        if (dataSource.skuId && dataSource.sku) {
          const selectedSorted = [...dataSource.selected].sort();
          const skuAttributesSorted = [...dataSource.sku.attributes].sort();

          // 使用 arrayEqual 代替 JSON.stringify（更高效）
          if (!arrayEqual(selectedSorted, skuAttributesSorted)) {
            unselectedNames.push(property.name);
          }
        } else {
          unselectedNames.push(property.name);
        }
      }
    });

    return unselectedNames;
  };

  initialValue && setOptions(deepClone(initialValue));

  return { data, selectAttribute, setOptions, unselectedName };
};

export { useSku };
