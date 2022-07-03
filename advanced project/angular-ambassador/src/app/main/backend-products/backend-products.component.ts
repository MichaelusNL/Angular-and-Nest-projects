import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/app/interfaces/link';
import { Product } from 'src/app/interfaces/product';
import { LinkService } from 'src/app/services/link.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-backend-products',
  templateUrl: './backend-products.component.html',
  styleUrls: ['./backend-products.component.css'],
})
export class BackendProductsComponent implements OnInit {
  products: Product[] = [];
  page: number = 1;
  showButton: boolean = true;
  selected: number[] = [];
  link = '';
  error = false;

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

    this.route.queryParams.subscribe((queryParams) => {
      this.page = Number(queryParams['page']) || 1;
      const s = queryParams['s'] || '';
      const sort = queryParams['sort'] || '';

      this.productService
        .backend({ page: this.page, s, sort })
        .subscribe((result) => {
          this.products =
            this.page === 1 ? result.data : [...this.products, ...result.data];
          this.showButton = Number(result.meta.lastPage) !== Number(this.page);
        });
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

  sort(event: Event): void {
    const sort = (event.target as HTMLInputElement).value;

    this.router.navigate([], {
      queryParams: { sort, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  select(id: number): void {
    console.log(id);
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
