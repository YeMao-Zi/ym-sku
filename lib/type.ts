export interface Attributes {
  value: string;
  isActive?: boolean;
  isDisabled?: boolean;
  [k: string]: any;
}

export type Properties = {
  name: string;
  attributes: Attributes[];
}[];

export interface Sku {
  id: string;
  attributes: string[];
  skuPrime?: number;
  [k: string]: any;
}

export type SkuList = Sku[];

export type ValueInLabel = Record<string, number>;

export type InitialValue = {
  properties: Properties;
  skuList: SkuList;
  skuId?: string;
};

export interface DataSource {
  properties: Properties;
  selected: string[];
  unDisabled: number[];
  skuList: SkuList;
  valueInLabel: ValueInLabel;
  vertexList: string[];
  skuId: string;
  sku?: Sku;
}

export interface ReturnData {
  skuList: SkuList;
  properties: Properties;
  selected: string[];
  skuId?: string;
  sku?: Sku;
}
