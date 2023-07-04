// type/index.ts
export declare namespace skuInfoPropsType {
    export type propertiesAttribute = {
      value: string;
      isActive: boolean;
      isDisabled: boolean;
    };
  
    export type skuinfo = {
      id: string;
      attributes: string[];
      stock: number;
      price: number;
      originalPrice: number;
    };
    export type properties = {
      name: string;
      attributes: propertiesAttribute[];
    }[];
  
    export type skuList = skuinfo[];
  
    export type defaultSkuId = string;
  }
  
  export interface skuInfoSettingType {
    properties: skuInfoPropsType.properties;
    skuList: skuInfoPropsType.skuList;
    matrix: any[]; // 邻接矩阵存储无向图
    vertexList: any[]; // 顶点数组
    selectedAttrs: any[]; // 当前已选的 attribute 列表
    selectedSkuInfo: skuInfoPropsType.skuinfo|null; // 当前已选中的sku选项信息
    skuId: skuInfoPropsType.defaultSkuId; // skuList组合中当前选中的的skuId
  }
  
  export interface skuInfoPropsDefaultType{
    properties: skuInfoPropsType.properties;
    skuList: skuInfoPropsType.skuList;
    defaultSkuId?: skuInfoPropsType.defaultSkuId;
  }
  
  export type skuInfoEmit = Omit<
    skuInfoSettingType & {
      shopingNum: number;
    },
    "vertexList" | "matrix" | "properties" | "skuList"
  >;