import { reactive } from 'vue';
import {
  skuInfoPropsType,
  skuInfoSettingType,
  skuInfoPropsDefaultType,
} from './type';

function objectEqual(obj1: any, obj2: any): boolean {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
      throw new TypeError("parameter must typeof object");
    }
    const obj1Constructor = obj1.constructor;
    const obj2Constructor = obj2.constructor;
  
    if (obj1Constructor !== obj2Constructor) {
      return false;
    }
  
    if (obj1 instanceof Array) {
      return ArrayEqual(obj1, obj2);
    } else {
      const entries1 = Object.entries(obj1);
      const entries2 = Object.entries(obj2);
      return ArrayEqual(entries1, entries2);
    }
  
    function ArrayEqual(arr1: any, arr2: any) {
      if (JSON.stringify(arr1.sort()) == JSON.stringify(arr2.sort())) {
        return true;
      } else {
        return false;
      }
    }
  }

const dataSource: skuInfoSettingType = reactive({
  properties: [], // property 列表
  skuList: [], // sku 列表
  matrix: [], // 邻接矩阵存储无向图
  vertexList: [], // 顶点数组
  selectedAttrs: [], // 当前已选的 attribute 列表
  selectedSkuInfo: null, // 当前已选中的sku选项信息
  skuId: '', // skuList组合中当前选中的的skuId,可以设置默认skuid(默认选中状态)
});

const getInit = (props: skuInfoPropsDefaultType) => {
  dataSource.properties = props.properties;
  dataSource.skuList = props.skuList;
  dataSource.skuId = props.defaultSkuId || props.skuList[0].id;
  initEmptyAdjMatrix();
  setAdjMatrixValue();
  // 默认选中项
  dataSource.skuId && selectedAttrsBySkuId(dataSource.skuId);
};

// 构造初始空邻接矩阵存储无向图
const initEmptyAdjMatrix = () => {
  // 获取顶点数组： ['2斤'，'4斤','豪华','精选']
  dataSource.properties.forEach((prop) => {
    prop.attributes.forEach((attr) => {
      dataSource.vertexList.push(attr.value);
    });
  });
  for (let i = 0; i < dataSource.vertexList.length; i++) {
    dataSource.matrix[i] = new Array(dataSource.vertexList.length).fill(0);
  }
};

// 根据 skuList 和 properties 设置邻接矩阵的值
const setAdjMatrixValue = () => {
  dataSource.skuList.forEach((sku) => {
    associateAttributes(sku.attributes, sku.id);
  });
  dataSource.properties.forEach((prop) => {
    associateAttributes(prop.attributes, '1');
  });
};

// 将 attributes 属性组中的属性在无向图中联系起来
const associateAttributes = (
  attributes: string[] | Array<skuInfoPropsType.propertiesAttribute>,
  skuId: skuInfoPropsType.defaultSkuId,
) => {
  attributes.forEach((attr1) => {
    attributes.forEach((attr2) => {
      // 因 properties 与 skuList 数据结构不一致，需作处理
      const attr1Value = (attr1 as skuInfoPropsType.propertiesAttribute).value;
      const attr2Value = (attr2 as skuInfoPropsType.propertiesAttribute).value;
      if (attr1 !== attr2 || attr1Value !== attr2Value) {
        if (attr1Value && attr2Value) {
          attr1 = attr1Value;
          attr2 = attr2Value;
        }
        const index1 = dataSource.vertexList.indexOf(attr1);
        const index2 = dataSource.vertexList.indexOf(attr2);
        if (index1 > -1 && index2 > -1) {
          if (dataSource.matrix[index1][index2]) {
            dataSource.matrix[index1][index2].add(skuId);
          } else {
            dataSource.matrix[index1][index2] = new Set([skuId]);
          }
        }
      }
    });
  });
};

// 根据skuid选中标签
const selectedAttrsBySkuId = (skuid: skuInfoPropsType.defaultSkuId) => {
  dataSource.selectedSkuInfo =
    dataSource.skuList.find((item) => item.id === skuid) || null;
  dataSource.selectedSkuInfo?.attributes.forEach((item: string) => {
    dataSource.properties.forEach((property, propertyIndex) => {
      property.attributes.forEach((attr, attributeIndex) => {
        if (attr.value === item) {
          handleClickAttribute(propertyIndex, attributeIndex);
        }
      });
    });
  });
};

// 判断当前 attribute 是否可选，返回 true 表示可选，返回 false 表示不可选，选项置灰
const canAttributeSelect = (
  attribute: skuInfoPropsType.propertiesAttribute,
) => {
  if (
    !dataSource.selectedAttrs ||
    !dataSource.selectedAttrs.length ||
    attribute.isActive
  ) {
    return true;
  }

  let res: any[] = [];
  dataSource.selectedAttrs.forEach((value: any) => {
    const index1 = dataSource.vertexList.indexOf(value);
    const index2 = dataSource.vertexList.indexOf(attribute.value);
    res.push(dataSource.matrix[index1][index2]);
  });

  if (res.some((item) => item === 0)) {
    return false;
  } else if (res.some((item) => item.has('1'))) {
    return true;
  } else {
    const first = res[0];
    const others = res.slice(1);
    return Array.from(first).some((skuId) =>
      others.every((item) => item.has(skuId)),
    );
  }
};

// 当点击某个 attribute 时，如：黑色
const handleClickAttribute = (
  propertyIndex: number,
  attributeIndex: number,
) => {
  setAttributestate(propertyIndex, attributeIndex);
  getSelectSku();
};

// 重置 attribute 状态
const setAttributestate = (propertyIndex: number, attributeIndex: number) => {
  const attr = dataSource.properties[propertyIndex].attributes[attributeIndex];
  // 若选项置灰，直接返回，表现为点击无响应
  if (attr.isDisabled) {
    return;
  }

  // 重置每个 attribute 的 isActive 状态
  const isActive = !attr.isActive;

  // 当取消选中时，清空skuID
  if (isActive === false) {
    dataSource.selectedSkuInfo = null;
  }
  dataSource.properties[propertyIndex].attributes[attributeIndex].isActive =
    isActive;
  if (isActive) {
    dataSource.properties[propertyIndex].attributes.forEach((attr, index) => {
      if (index !== attributeIndex) {
        attr.isActive = false;
      }
    });
  }
  // 维护当前已选的 attribute 列表
  dataSource.selectedAttrs = [];
  dataSource.properties.forEach((prop) => {
    prop.attributes.forEach((attr) => {
      if (attr.isActive) {
        dataSource.selectedAttrs.push(attr.value);
      }
    });
  });
  // 重置每个 attribute 的 isDisabled 状态
  dataSource.properties.forEach((prop) => {
    prop.attributes.forEach((attr) => {
      attr.isDisabled = !canAttributeSelect(attr);
    });
  });
};

// 判断是否选中sku并获取
const getSelectSku = () => {
  // 判断是否含已有sku组合并获取
  dataSource.skuList.forEach((item) => {
    if (objectEqual(item.attributes, dataSource.selectedAttrs)) {
      dataSource.selectedSkuInfo = item;
    }
  });
  // 获取skuID
  if (dataSource.selectedSkuInfo?.id) {
    dataSource.skuId = dataSource.selectedSkuInfo.id;
  } else {
    dataSource.skuId = '';
  }
};

// 获取未选中标签
const getUnchooseLabel = () => {
  const unChooseLabel: string[] = [];
  dataSource.properties.forEach((prop) => {
    const hasLabel = prop.attributes.some((attr) => {
      return attr.isActive === true;
    });
    if (!hasLabel) {
      unChooseLabel.push(prop.name);
    }
  });
  return unChooseLabel;
};

const myUseSkuState = (
  initialValue: skuInfoPropsDefaultType,
): [
  skuInfoSettingType,
  (propertyIndex: number, attributeIndex: number) => void,
] => {
  if (dataSource.properties.length === 0) {
    console.log(initialValue);
    getInit(initialValue);
  }
  return [dataSource, handleClickAttribute];
};

export {
  getInit,
  dataSource,
  handleClickAttribute,
  getUnchooseLabel,
  myUseSkuState,
};
