## 介绍

基于 vue3 + ts + hooks 的响应式 sku 数据处理插件
为了样式的可定制化,只处理 sku 数据,UI 可自己随意绘制
基本功能应该都能实现

## 安装

### npm 安装

```
npm install ym-sku
```

## 示例

[example](https://codepen.io/zhushengjie123/pen/ByBBbpw)

## 使用

```vue
<template>
  <div>
    <div v-for="(item, propertyIndex) in dataSource.properties" :key="propertyIndex">
      <div>{{ item.name }}</div>
      <div class="attrbute">
        <div
          v-for="(attribute, attributeIndex) in item.attributes"
          :key="attributeIndex"
          @click="handleClick(propertyIndex, attributeIndex)"
          class="weight"
          :class="{
            seletedSpecifications: attribute.isActive,
            disabledStyle: attribute.isDisabled,
          }"
        >
          <div>{{ attribute?.label || attribute.value }}</div>
        </div>
      </div>
    </div>
    <p>price:{{ dataSource.sku?.price }}</p>
    <button @click="testFn">test</button>
  </div>
</template>

<script lang="ts" setup>
import { useSku, unselectedName, setOptions } from "ym-sku";

const properties = [
  {
    name: "Size",
    attributes: [
      { label: "S", value: "S", isActive: true }, // 默认选中
      { label: "S", value: "M" },
      { label: "L", value: "L" },
      { label: "Y", value: "Y" },
      { label: "B", value: "B" },
    ],
  },
  {
    name: "Color",
    attributes: [{ value: "red", isActive: true }, { value: "green" }],
  },
  {
    name: "Figure ",
    attributes: [
      { label: "stripe", value: "stripe" },
      { label: "wave", value: "wave", isActive: true }, // 和 skuId:10（["S", "red", "stripe"]） 冲突，会抛出错误且不会被选中
    ],
  },
];

const skuList = [
  {
    id: "10",
    attributes: ["S", "red", "stripe"],
    stock: 12,
    price: 10,
    originalPrice: 100,
  },
  {
    id: "20",
    attributes: ["S", "green", "wave"],
    stock: 30,
    price: 20,
    originalPrice: 100,
  },
  {
    id: "30",
    attributes: ["M", "red", "stripe"],
    stock: 20,
    price: 30,
    originalPrice: 100,
  },
  {
    id: "40",
    attributes: ["L", "red"],
    stock: 15,
    price: 40,
    originalPrice: 100,
  },
];

const props = {
  properties,
  skuList,
  // skuId: "40", // select skuId:40
};

const [dataSource, handleClickAttribute] = useSku(props);

const handleClick = (propertyIndex: number, attributeIndex: number) => {
  const attrbute = handleClickAttribute(propertyIndex, attributeIndex);
  console.log(attrbute);
};

const testFn = () => {
  console.log(dataSource, unselectedName());
  // select skuId:40
  // setOptions({ skuId: "40" });
};
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
  margin: 10px 0;
  background: #ffffff;
  border-radius: 10px;
  border: 2px solid #a6a6a6;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin-right: 10px;
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
    skuId?: string;
    // 当前选中的sku
    sku?: {
        [x: string]: any;
        id: string;
        attributes: string[];
        skuPrime?: number;
    };
}>
```

### 自定义

```ts
import { useSku, setOptions, unselectedName } from "@/ym-sku/index";
const handleClick = () => {
  // 手动控制属性，这里是更改了选中的sku, 你也可以修改 properties 或 skuList，
  setOptions({
    // properties,
    // skuList,
    skuId: skuList[1].id,
  });
  // 获取未选择的 name
  console.log(unselectedName());
};
```
