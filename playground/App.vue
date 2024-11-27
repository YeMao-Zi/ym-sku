<template>
  <div v-for="(item, propertyIndex) in dataSource.properties" :key="propertyIndex">
    <div>{{ item.name }}</div>
    <div class="attrbute">
      <div
        v-for="(attribute, attributeIndex) in item.attributes"
        :key="attributeIndex"
        @click="handleClickAttribute(propertyIndex, attributeIndex)"
        class="weight"
        :class="{ seletedSpecifications: attribute.isActive, disabledStyle: attribute.isDisabled }"
      >
        <div>{{ attribute?.label || attribute.value }}</div>
      </div>
    </div>
  </div>
  <button @click="getSkuInfo">getSkuInfo</button>
</template>

<script lang="ts" setup>
import { useSku, getUnchooseLabel, init } from "ym-sku";

const properties = [
  {
    name: "Size",
    attributes: [
      { label: "S", value: "S", isActive: true },
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
  // skuId: "40",
};

const [dataSource, handleClickAttribute] = useSku(props);

const getSkuInfo = () => {
  console.log(dataSource, getUnchooseLabel());
  // init({ skuId: "40" });
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
