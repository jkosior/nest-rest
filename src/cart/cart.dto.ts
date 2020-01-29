export class AddCartProduct {
  readonly id: string;
  readonly quantity: number;
}

export class CartProduct {
  id: string;
  price: number;
  quantity: number;
}

export class CreateCartDto {
  readonly owner: string;
  readonly currency: string;
  readonly description?: string;
}

export class CartDto {
  id: string;
  owner: string;
  isCheckedOut: boolean;
  products?: CartProduct[];
  currency: string;
  totalPrice?: number;
  description?: string;
}
