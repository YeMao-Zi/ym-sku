export interface Attribute {
  value: any;
  isActive?: boolean;
  isDisabled?: boolean;
  [k: string]: any;
}

export type Property = {
  name: string;
  attributes: Attribute[];
};

export interface Sku {
  id: any;
  attributes: any[];
  skuPrime?: number[];
  [k: string]: any;
}

export type ValueInLabel = Record<string, number>;

export type InitialValue<P, S> = {
  properties: P[];
  skuList: S[];
  skuId?: any;
};

export interface DataSource {
  properties: Property[];
  selected: any[];
  unDisabled: number[];
  skuList: Sku[];
  valueInLabel: ValueInLabel;
  vertexList: any[];
  skuId: any;
  sku?: Sku;
}

export interface ReturnData<P, S> {
  skuList: S[];
  properties: P[];
  selected: any[];
  skuId?: any;
  sku?: S;
}

export interface Options<P, S> {
  onChange?: (data: ReturnData<P, S>) => void;
}

// export type useSku = (
//   initialValue: InitialValue,
//   options: Options
// ) => {
//   data: ReturnData;
//   handleClickAttribute: (propertyIndex: number, attributeIndex: number) => Attribute;
// };
