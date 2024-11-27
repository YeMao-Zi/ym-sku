export interface Attributes {
  value: any;
  isActive?: boolean;
  isDisabled?: boolean;
  [k: string]: any;
}

export type Properties = {
  name: string;
  attributes: Attributes[];
}[];

export interface Sku {
  id: any;
  attributes: any[];
  skuPrime?: number[];
  [k: string]: any;
}

export type SkuList = Sku[];

export type ValueInLabel = Record<string, number>;

export type InitialValue = {
  properties: Properties;
  skuList: SkuList;
  skuId?: any;
};

export interface DataSource {
  properties: Properties;
  selected: any[];
  unDisabled: number[];
  skuList: SkuList;
  valueInLabel: ValueInLabel;
  vertexList: any[];
  skuId: any;
  sku?: Sku;
}

export interface ReturnData {
  skuList: SkuList;
  properties: Properties;
  selected: any[];
  skuId?: any;
  sku?: Sku;
}
