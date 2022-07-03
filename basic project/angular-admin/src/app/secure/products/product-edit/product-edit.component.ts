import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  form!: FormGroup;
  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
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

    this.id = this.route.snapshot.params['id'];

    this.productService.get(this.id).subscribe((prod: any) => {
      this.form.patchValue(prod);
    });
  }

  submit(): void {
    this.productService
      .update(this.id, this.form.getRawValue())
      .subscribe(() => {
        this.router.navigate(['/products']);
      });
  }
}
