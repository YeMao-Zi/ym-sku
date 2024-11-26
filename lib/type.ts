export type Properties = {
  name: string;
  attributes: {
    value: string;
    isActive: boolean;
    isDisabled: boolean;
  }[];
}[];

export type SkuList = {
  id: string;
  attributes: string[];
  skuPrime?: number;
}[];

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
}
