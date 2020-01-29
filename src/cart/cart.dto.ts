import { ProductDto } from '@product/product.dto';

export interface CartProduct {
  id: string;
  price: number;
  quantity: number;
}

export class CreateCartDto {
  readonly owner: string;
  readonly isCheckedOut: boolean;
}
export interface CartDto {
  id: string;
  owner: string;
  isCheckedOut: boolean;
  products?: CartProduct[];
  currency: string;
  totalPrice?: number;
}