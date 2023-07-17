## 介绍

基于 vue3 + ts + hooks 的响应式 sku 数据处理插件
为了样式的可定制化,只处理 sku 数据,UI 可自己随意绘制
基本能实现所有你想要的功能

## 安装

### npm 安装

```
npm install ym-sku
```

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
import { myUseSkuState,type skuInfoPropsType } from "ym-sku";

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

const props = {
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
  padding: 5px 20px;
  text-align: center;
  margin: 10rpx 0;
  background: #ffffff;
  border-radius: 10rpx;
  border: 2px solid #a6a6a6;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin-right: 20rpx;
}

.disabledStyle {
  background-color: #f7f7f7;
}

.seletedSpecifications {
  border: 2px solid #fb6e23;
}
</style>
```

### 其中返回的 dataSource 说明

```js
const dataSource = {
  properties: [], // property 列表
  skuList: [], // sku 列表
  selected: [], // 当前已选的 attribute 列表
  skuId: "", // skuList组合中当前选中的的skuId,可以设置默认skuid(默认选中状态)
};
```

### 自定义

``` ts
import {
  myUseSkuState,
  init,
  getUnchooseLabel,
} from '@/ym-sku/index';
const test = () => {
 // 手动控制属性，这里是更改了选中的sku, 你也可以修改 properties 或 skuList，
  init({ properties, skuList, defaultSkuId: skuList[1].id });
  // 获取未选择标签
  console.log(getUnchooseLabel()); 
};
```
