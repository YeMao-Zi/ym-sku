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

export interface DataSource<P, S> {
  properties: P[];
  selected: any[];
  unDisabled: number[];
  skuList: S[];
  valueInLabel: ValueInLabel;
  vertexList: any[];
  skuId?: any;
  sku?: S;
}

export interface Data<P, S> {
  skuList: S[];
  properties: P[];
  selected: any[];
  skuId?: any;
  sku?: S;
}

export interface Options<P, S> {
  onChange?: (data: Data<P, S>) => void;
}
