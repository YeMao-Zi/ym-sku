<template>
  <div>
    <div
      v-for="(item, propertyIndex) in dataSourse.properties"
      :key="propertyIndex"
    >
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
          <div>{{ attribute.label || attribute.value }}</div>
          <div class="disabledText">{{ disabledType(attribute) }}</div>
        </div>
      </div>
    </div>
    <p v-if="dataSourse.sku">price:{{ dataSourse.sku.price }}</p>
    <button @click="testFn">test</button>
  </div>
</template>

<script>
import { useSku } from "ym-sku";

export default {
  data() {
    const {
      data: dataSourse,
      selectAttribute,
      setOptions,
      unselectedName,
    } = useSku(null, {
      onChange: (data) => {
        this.dataSourse = { ...data };
      },
    });

    return {
      skuList: [],
      dataSourse,
      selectAttribute,
      setOptions,
      unselectedName,
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
        stock: 0,
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
        expired: true,
        originalPrice: 100,
      },
    ];
    this.skuList = skuList;
    this.setOptions({
      properties,
      skuList: skuList.filter((item) => item.stock > 0 && !item.expired),
    });
  },
  methods: {
    handleClick(propertyIndex, attributeIndex) {
      const attrbute = this.selectAttribute(propertyIndex, attributeIndex);
      console.log(attrbute);
    },
    disabledType(attr) {
      const selected = this.dataSourse.selected;
      const properties = this.dataSourse.properties;
      const visibleSkuList = this.dataSourse.skuList;
      const isPossible = visibleSkuList.find((item) =>
        item.attributes.includes(attr.value)
      );
      const unSelectName = this.unselectedName();
      const activeProperty = properties.find((item) =>
        item.attributes.map((a) => a.value).includes(attr.value)
      );
      const sameNameAttrs = activeProperty.attributes.map((item) => item.value);
      const otherNameSelected = selected.filter(
        (item) => !sameNameAttrs.includes(item)
      );
      const expiredSku = this.skuList.find((sku) => {
        if (unSelectName.length) {
          const isAllIncluded = otherNameSelected.every((item) =>
            sku.attributes.includes(item)
          );
          return (
            sku.attributes.includes(attr.value) && isAllIncluded && sku.expired
          );
        } else {
          return sku.attributes.includes(attr.value) && sku.expired;
        }
      });
      const soldOutSku = this.skuList.find((sku) => {
        const isAllIncluded = selected.every((item) =>
          sku.attributes.includes(item)
        );
        return (
          sku.attributes.includes(attr.value) && isAllIncluded && sku.stock <= 0
        );
      });
      // console.log(attr, expiredSku, 'disabledType',sameNameAttrs, soldOutSku,otherNameSelected,selected)
      if (expiredSku && attr.isDisabled) {
        return "下架";
      }
      if (soldOutSku && selected.length && !isPossible) {
        return "无库存";
      }
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
  position: relative;
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
  background-color: #e6e6e6;
}

.disabledText {
  position: absolute;
  top: -10px;
  right: 0;
  color: red;
  font-size: 10px;
}

.seletedSpecifications {
  border: 2px solid #fb6e23;
}
</style>
