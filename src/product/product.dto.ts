export interface PriceDto {
  name: string;
  value: number;
}

export interface ProductDto {
  name: string;
  price: PriceDto[];
  quantity: number;
}
