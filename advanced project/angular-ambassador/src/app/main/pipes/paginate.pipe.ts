import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Pipe({
  name: 'paginate',
})
export class PaginatePipe implements PipeTransform {
  transform(products: Product[], page: number, perPage: number): Product[] {
    return products.slice(0, page * perPage);
  }
}
