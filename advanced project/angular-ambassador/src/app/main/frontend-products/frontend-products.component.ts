import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Link } from 'src/app/interfaces/link';
import { Product } from 'src/app/interfaces/product';
import { LinkService } from 'src/app/services/link.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-frontend-products',
  templateUrl: './frontend-products.component.html',
  styleUrls: ['./frontend-products.component.css'],
})
export class FrontendProductsComponent implements OnInit {
  products: Product[] = [];
  showButton: boolean = true;
  selected: number[] = [];
  link = '';
  error = false;

  page: number = 1;
  s = '';
  sort = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private linkService: LinkService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['page'] > this.page) {
      this.page = 0;
      this.loadMore();
    }

    this.productService.frontend().subscribe((products: Product[]) => {
      this.products = products;
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.page = Number(queryParams['page']) || 1;
      this.s = queryParams['s'] || '';
      this.sort = queryParams['sort'] || '';
    });
  }

  loadMore(): void {
    this.page++;
    this.router.navigate([], {
      queryParams: { page: this.page },
      queryParamsHandling: 'merge',
    });
  }

  search(event: Event): void {
    const s = (event.target as HTMLInputElement).value;

    this.router.navigate([], {
      queryParams: { s, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  sortChange(event: Event): void {
    const sort = (event.target as HTMLInputElement).value;

    this.router.navigate([], {
      queryParams: { sort, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  select(id: number): void {
    if (!this.isSelected(id)) {
      this.selected = [...this.selected, id];
      return;
    }

    this.selected = this.selected.filter((s) => s !== id);
  }

  isSelected(id: number): boolean {
    return this.selected.some((s) => s === id);
  }

  generate(): void {
    this.linkService.generate({ products: this.selected }).subscribe(
      (link: Link) => {
        this.link = `${environment.checkoutUrl}/${link.code}`;
      },
      () => (this.error = true)
    );
  }
}
