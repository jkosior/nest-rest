export class CartProduct {
  id: string;
  price: number;
  quantity: number;
}

export class CreateCartDto {
  readonly owner: string;
  readonly isCheckedOut: boolean;
}
export class CartDto {
  id: string;
  owner: string;
  isCheckedOut: boolean;
  products?: CartProduct[];
  currency: string;
  totalPrice?: number;
}
