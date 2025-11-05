<template>
  <div>
    <div v-for="(item, propertyIndex) in data.properties" :key="propertyIndex">
      <div>{{ item.name }}</div>
      <div class="attrbute">
        <div
          v-for="(attribute, attributeIndex) in item.attributes"
          :key="attributeIndex"
          @click="handleClick(propertyIndex, attributeIndex)"
          class="weight"
          :class="{
            seletedSpecifications: attribute.isActive,
            disabledStyle: attribute?.isDisabled,
          }"
        >
          <div>{{ attribute?.label || attribute.value }}</div>
        </div>
      </div>
    </div>
    <p>price:{{ dataSourse?.sku?.price }}</p>
    <button @click="testFn">test</button>
  </div>
</template>

<script>
import { useSku } from "ym-sku";

export default {
  name: "App2",
  data() {
    const {
      data: dataSourse,
      selectAttribute,
      setOptions,
      unselectedName,
    } = useSku(null, {
      onChange: () => {
        const { properties } = this.dataSourse;
        this.data.properties = properties;
      },
    });

    return {
      properties: dataSourse.properties,
      dataSourse,
      selectAttribute,
      setOptions,
      unselectedName,
      data: { properties: dataSourse.properties },
    };
  },
  mounted() {
    const properties = [
      {
        name: "Size",
        attributes: [
          { label: "S", value: "S", isActive: true }, // 默认选中
          { label: "M", value: "M" },
          { label: "L", value: "L" },
        ],
      },
      {
        name: "Color",
        attributes: [
          { label: "red", value: "red", isActive: true },
          { value: "green" },
        ],
      },
      {
        name: "Figure ",
        attributes: [
          { label: "stripe", value: "stripe" },
          { label: "wave", value: "wave", isActive: true }, // 不存在 sku:["S","red","wave"]，会抛出错误且不会被选中
        ],
      },
    ];

    const skuList = [
      {
        id: 10,
        attributes: ["S", "red", "stripe"],
        expired: true,
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
    this.setOptions({
      properties,
      skuList: skuList.filter((item) => !item.expired),
    });
  },
  methods: {
    handleClick(propertyIndex, attributeIndex) {
      const attrbute = this.selectAttribute(propertyIndex, attributeIndex);
      console.log(attrbute);
    },
    testFn() {
      const names = this.unselectedName();
      if (names.length) {
        alert(`please select ${names.join(",")}`);
      }
      // select skuId:40
      // this.setOptions({ skuId: "40" });
    },
  },
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
