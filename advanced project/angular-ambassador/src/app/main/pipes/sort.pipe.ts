import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(products: Product[], sort: string): Product[] {
    if (sort === 'asc' || sort === 'desc') {
      return sort === 'asc'
        ? products.sort((a, b) => a.price - b.price)
        : products.sort((a, b) => b.price - a.price);
    }

    return products;
  }
}
