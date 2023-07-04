## 介绍

基于 vue3 + ts + hooks 的响应式 sku 数据处理插件
为了样式的可定制化,只处理 sku 数据,UI 可自己随意绘制

## 安装

### npm 安装

```
npm install ym-sku
```

hbuilderx 导入的路径应该是这个 `@/js_sdk/ym-sku/ym-sku` 

## 使用

```vue
<template>
  <div v-for="(item, propertyIndex) in dataSource.properties" :key="propertyIndex">
    <div>{{ item.name }}</div>
    <div class="attrbute">
      <div
        v-for="(attribute, attributeIndex) in item.attributes"
        :key="attributeIndex"
        @click="handleClickAttribute(propertyIndex, attributeIndex)"
        :class="[
          'weight',
          attribute.isActive ? 'seletedSpecifications' : '',
          attribute.isDisabled ? 'disabledStyle' : '',
        ]"
      >
        <div>{{ attribute.value }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { myUseSkuState, skuInfoPropsType } from "ym-sku";
// import { myUseSkuState, skuInfoPropsType } from "@/js_sdk/ym-sku/ym-sku"; 如果是 Hubilder 导入可能是这个路径，找到这个文件即可

interface propsType {
  properties: skuInfoPropsType.properties;
  skuList: skuInfoPropsType.skuList;
  defaultSkuId?: skuInfoPropsType.defaultSkuId; //默认选中id
}

// data.ts
const properties = [
  {
    name: "Size",
    attributes: [
      { value: "S", isActive: false, isDisabled: false },
      { value: "M", isActive: false, isDisabled: false },
      { value: "L", isActive: false, isDisabled: false },
      { value: "Y", isActive: false, isDisabled: false },
      { value: "B", isActive: false, isDisabled: false },
    ],
  },
  {
    name: "Color",
    attributes: [
      { value: "red", isActive: false, isDisabled: false },
      { value: "green", isActive: false, isDisabled: false },
    ],
  },
  {
    name: "Figure ",
    attributes: [
      { value: "stripe", isActive: false, isDisabled: false },
      { value: "wave", isActive: false, isDisabled: false },
    ],
  },
];

const skuList = [
  {
    id: "10",
    attributes: ["S", "red", "stripe"],
    stock: 12,
    price: 100,
    originalPrice: 150,
  },
  {
    id: "20",
    attributes: ["S", "green", "wave"],
    stock: 30,
    price: 100,
    originalPrice: 110,
  },
  {
    id: "30",
    attributes: ["M", "red", "stripe"],
    stock: 20,
    price: 100,
    originalPrice: 130,
  },
  {
    id: "40",
    attributes: ["L", "red", "wave"],
    stock: 15,
    price: 100,
    originalPrice: 120,
  },
];

const props: propsType = {
  properties,
  skuList,
};

const [dataSource, handleClickAttribute] = myUseSkuState(props);
</script>

<style lang="scss" scoped>
.attrbute {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
}

.weight {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5rpx 20rpx;
  text-align: center;
  margin: 10rpx 0;
  background: #ffffff;
  border-radius: 10rpx;
  border: 2rpx solid #a6a6a6;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin-right: 20rpx;
}

.disabledStyle {
  background-color: #f7f7f7;
}

.seletedSpecifications {
  border: 2rpx solid #fb6e23;
}
</style>
```

### 其中返回的 dataSource 说明

```js
const dataSource: skuInfoSettingType = reactive({
  properties: [], // property 列表
  skuList: [], // sku 列表
  matrix: [], // 邻接矩阵存储无向图
  vertexList: [], // 顶点数组
  selectedAttrs: [], // 当前已选的 attribute 列表
  selectedSkuInfo: null, // 当前已选中的sku选项信息
  skuId: "", // skuList组合中当前选中的的skuId,可以设置默认skuid(默认选中状态)
});
```
