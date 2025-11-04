import { useSku } from "../dist";

// 测试数据
const properties = [
  {
    name: "Size",
    attributes: [
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
    ],
  },
  {
    name: "Color",
    attributes: [
      { label: "Red", value: "Red" },
      { label: "Blue", value: "Blue" },
    ],
  },
];

const skuList = [
  {
    id: 1,
    attributes: ["S", "Red"],
    price: 10,
  },
  {
    id: 2,
    attributes: ["S", "Blue"],
    price: 12,
  },
  {
    id: 3,
    attributes: ["M", "Red"],
    price: 15,
  },
  {
    id: 4,
    attributes: ["M", "Blue"],
    price: 17,
  },
  {
    id: 5,
    attributes: ["L", "Red"],
    price: 20,
  },
];

describe("useSku", () => {
  test("should initialize with correct data", () => {
    const { data } = useSku({ properties, skuList });
    
    // 检查数据是否正确初始化
    expect(data.properties).toHaveLength(2);
    expect(data.skuList).toHaveLength(5);
    expect(data.selected).toHaveLength(0);
    expect(data.sku).toBeUndefined();
    expect(data.skuId).toBe("");
  });

  test("should select attribute correctly", () => {
    const { data, selectAttribute } = useSku({ properties, skuList });
    
    // 选择第一个属性的第一个选项 (Size: S)
    const attribute = selectAttribute(0, 0);
    
    expect(attribute.value).toBe("S");
    expect(data.selected).toContain("S");
    expect(attribute.isActive).toBe(true);
  });

  test("should update sku when all attributes are selected", () => {
    const { data, selectAttribute } = useSku({ properties, skuList });
    
    // 选择 Size: S
    selectAttribute(0, 0);
    // 选择 Color: Red
    selectAttribute(1, 0);
    
    // 检查是否正确匹配到 SKU
    expect(data.skuId).toBe(1);
    expect(data.sku).toBeDefined();
    expect(data.sku?.price).toBe(10);
  });

  test("should handle unselectedName correctly", () => {
    const { data, selectAttribute, unselectedName } = useSku({ properties, skuList });
    
    // 初始状态，所有规格都未选择
    let names = unselectedName();
    expect(names).toHaveLength(2);
    expect(names).toContain("Size");
    expect(names).toContain("Color");
    
    // 选择 Size: S
    selectAttribute(0, 0);
    names = unselectedName();
    expect(names).toHaveLength(1);
    expect(names).toContain("Color");
    
    // 选择 Color: Red
    selectAttribute(1, 0);
    names = unselectedName();
    expect(names).toHaveLength(0);
  });

  test("should handle setOptions correctly", () => {
    const { data, setOptions } = useSku(null);
    
    // 初始状态没有数据
    expect(data.properties).toHaveLength(0);
    expect(data.skuList).toHaveLength(0);
    
    // 设置数据
    setOptions({ properties, skuList });
    
    // 检查数据是否正确设置
    expect(data.properties).toHaveLength(2);
    expect(data.skuList).toHaveLength(5);
  });

  test("should handle skuId initialization correctly", () => {
    const { data } = useSku({ 
      properties, 
      skuList, 
      skuId: 3 
    });
    
    // 检查是否根据 skuId 正确初始化
    expect(data.skuId).toBe(3);
    expect(data.sku).toBeDefined();
    expect(data.selected).toContain("M");
    expect(data.selected).toContain("Red");
  });

  test("should toggle attribute selection", () => {
    const { data, selectAttribute } = useSku({ properties, skuList });
    
    // 选择 Size: S
    selectAttribute(0, 0);
    expect(data.selected).toContain("S");
    expect(data.selected).toHaveLength(1);
    
    // 再次选择 Size: S 应该取消选择
    selectAttribute(0, 0);
    expect(data.selected).toHaveLength(0);
  });
});