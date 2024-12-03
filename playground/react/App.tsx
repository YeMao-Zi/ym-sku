import { useMemo, useState } from "react";
import "./styles.css";
import { useSku } from "ym-sku";
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
    attributes: [{ label: "red", value: "red", isActive: true }, { value: "green" }],
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
};

export default function App() {
  const {
    data: skuData,
    selectAttribute,
    unselectedName,
  } = useMemo(() => {
    return useSku(props, {
      onChange() {
        setData(() => ({ ...skuData }));
      },
    });
  }, []);
  const [data, setData] = useState(skuData);
  const handleClick = (propertyIndex: number, attributeIndex: number) => {
    const attrbute = selectAttribute(propertyIndex, attributeIndex);
    console.log(attrbute, "attrbute");
  };

  const testFn = () => {
    const names = unselectedName();
    if (names.length) {
      alert(`please select ${names.join(",")}`);
    }
    // select skuId:40
    // setOptions({ skuId: "40" });
  };

  return (
    <div>
      {data.properties.map((item, propertyIndex) => (
        <div key={propertyIndex}>
          <div>{item.name}</div>
          <div className="attrbute">
            {item.attributes.map((attribute, attributeIndex) => (
              <div
                className={`weight ${attribute.isActive ? "seletedSpecifications" : ""} ${
                  attribute?.isDisabled ? "disabledStyle" : ""
                }`}
                key={attributeIndex}
                onClick={() => handleClick(propertyIndex, attributeIndex)}
              >
                <div>{attribute?.label || attribute.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p>price:{data.sku?.price}</p>
      <button onClick={testFn}>test</button>
    </div>
  );
}
