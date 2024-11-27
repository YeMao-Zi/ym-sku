## 介绍

基于 vue3 + ts + hooks 的响应式 sku 数据处理插件
为了样式的可定制化,只处理 sku 数据,UI 可自己随意绘制
基本功能应该都能实现

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
        <div>{{ attribute?.label || attribute.value }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSku } from "ym-sku";

const properties = [
  {
    name: "Size",
    attributes: [
      { label: "S", value: "S", isActive: true }, // 可以定义默认标签的选中状态
      { label: "S", value: "M" },
      { label: "L", value: "L" },
      { label: "Y", value: "Y" },
      { label: "B", value: "B" },
    ],
  },
  {
    name: "Color",
    attributes: [{ value: "red" }, { value: "green" }],
  },
  {
    name: "Figure ",
    attributes: [
      { label: "", value: "stripe" },
      { label: "", value: "wave" },
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
    attributes: ["L", "red"],
    stock: 15,
    price: 100,
    originalPrice: 120,
  },
];

const props = {
  properties,
  skuList,
};

const [dataSource, handleClickAttribute] = useSku(props);
</script>

<style scoped>
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

### 其中返回的 dataSource 签名

```js
const dataSource: ComputedRef<{
  // property 列表
    properties: {
        name: string;
        attributes: {
            [x: string]: any;
            value: string;
            isActive?: boolean;
            isDisabled?: boolean;
        }[];
    }[];
    // sku列表
    skuList: {
        [x: string]: any;
        id: string;
        attributes: string[];
        skuPrime?: number;
    }[];
    selected: string[];
    // 当前选中的skuId
    skuId: string;
    // 当前选中的sku
    sku: {
        [x: string]: any;
        id: string;
        attributes: string[];
        skuPrime?: number;
    };
}>
```

### 自定义

```ts
import { useSku, init, getUnchooseLabel } from "@/ym-sku/index";
const handleClick = () => {
  // 手动控制属性，这里是更改了选中的sku, 你也可以修改 properties 或 skuList，
  init({ properties, skuList, defaultSkuId: skuList[1].id });
  // 获取未选择标签
  console.log(getUnchooseLabel());
};
```
