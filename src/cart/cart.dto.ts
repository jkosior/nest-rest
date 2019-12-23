import { ProductDto } from '@product/product.dto';

export interface CartDto {
  user: string;
  isCheckedOut: boolean;
  products?: ProductDto[];
}
