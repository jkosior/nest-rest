export class PriceDto {
  name: string;
  value: number;
}

export class CreateProductDto {
  readonly name: string;
  readonly price: PriceDto[];
  readonly quantity: number;
}

export class ProductDto {
  id: string;
  name?: string;
  price?: PriceDto[];
  quantity?: number;
}