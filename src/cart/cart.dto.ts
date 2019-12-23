import { ProductDto } from '@product/product.dto';

export interface CartDto {
  user: string;
  products?: ProductDto[];
}
