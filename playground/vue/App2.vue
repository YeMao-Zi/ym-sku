<template>
  <div>
    <div v-for="(item, propertyIndex) in dataSourse.properties" :key="propertyIndex">
      <div>{{ item.name }}</div>
      <div class="attrbute">
        <div v-for="(attribute, attributeIndex) in item.attributes" :key="attributeIndex"
          @click="handleClick(propertyIndex, attributeIndex)" class="weight" :class="{
            seletedSpecifications: attribute.isActive,
            disabledStyle: attribute?.isDisabled,
          }">
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
      onChange: (data) => {
        console.log(data, "onChange");
        this.dataSourse = { ...data };
      },
    });

    return {
      dataSourse,
      selectAttribute,
      setOptions,
      unselectedName,
    };
  },
  mounted() {
    const properties = [
      {
        "specId": 1001,
        "name": "颜色",
        "attributes": [
          {
            "itemId": 86,
            "label": "紫色",
            "value": "紫色",
            "active": false,
            "isActive": false,
            "isDisabled": false
          },
          {
            "itemId": 87,
            "label": "黑色",
            "value": "黑色",
            "active": false,
            "isActive": false,
            "isDisabled": false
          },
          {
            "itemId": 88,
            "label": "黄色",
            "value": "黄色",
            "active": true,
            "isActive": true,
            "isDisabled": false
          }
        ]
      },
      {
        "specId": 1002,
        "name": "尺码",
        "attributes": [
          {
            "itemId": 103,
            "label": "sxe123",
            "value": "sxe123",
            "active": true,
            "isActive": true,
            "isDisabled": false
          }
        ]
      },
      {
        "specId": 1008,
        "name": "功率",
        "attributes": [
          {
            "itemId": 126,
            "label": "8杠",
            "value": "8杠",
            "active": false,
            "isActive": false,
            "isDisabled": false
          },
          {
            "itemId": 127,
            "label": "350km/h",
            "value": "350km/h",
            "active": true,
            "isActive": true,
            "isDisabled": false
          }
        ]
      }
    ]
    const skuList = [
      {
        "id": 383,
        "attributes": [
          "紫色",
          "sxe123",
          "8杠"
        ],
        "item_enable": 1001,
        "stock": 21,
        "price": 860,
        "expired": false
      },
      {
        "id": 386,
        "attributes": [
          "黑色",
          "sxe123",
          "350km/h"
        ],
        "item_enable": 1001,
        "stock": 524,
        "price": 34.51,
        "expired": false
      },
      {
        "id": 387,
        "attributes": [
          "黄色",
          "sxe123",
          "8杠"
        ],
        "item_enable": 1001,
        "stock": 211,
        "price": 1000.01,
        "expired": false
      },
      {
        "id": 388,
        "attributes": [
          "黄色",
          "sxe123",
          "350km/h"
        ],
        "item_enable": 1001,
        "stock": 4974,
        "price": 39,
        "expired": false
      }
    ]
    console.log('mounted setOptions', properties, skuList);
    this.setOptions({
      properties,
      skuList,
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
