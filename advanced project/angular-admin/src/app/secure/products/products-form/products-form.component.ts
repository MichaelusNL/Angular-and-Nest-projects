import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../app/services/product.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.css'],
})
export class ProductsFormComponent implements OnInit {
  form!: FormGroup;
  create!: boolean;
  id?: number;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: '',
      description: '',
      price: '',
      image: '',
    });

    this.create = this.route.snapshot.data['create'];

    if (!this.create) {
      this.id = this.route.snapshot.params['id'];

      this.productService.get(this.id!).subscribe((product) => {
        this.form.patchValue(product);
      });
    }
  }

  submit(): void {
    const method = this.create
      ? this.productService.create(this.form.getRawValue())
      : this.productService.update(this.id!, this.form.getRawValue());

    method.subscribe(() => this.router.navigate(['/products']));
  }
}
