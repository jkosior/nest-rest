export class Price {
  name: string;
  value: number;
}

export class CreateProductDto {
  readonly name: string;
  readonly price: Price[];
  readonly quantity: number;
  readonly description?: string;
}

export class ProductDto {
  id: string;
  name?: string;
  price?: Price[];
  quantity?: number;
  description?: string;
}
