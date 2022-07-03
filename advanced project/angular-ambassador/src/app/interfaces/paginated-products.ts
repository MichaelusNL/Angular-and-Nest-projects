import { Product } from './product';

export interface PaginatedProducts {
  data: Product[];
  meta: { total: number; page: number; lastPage: number };
}
