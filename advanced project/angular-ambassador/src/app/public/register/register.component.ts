import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', './../public.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    });
  }

  submit(): void {
    this.authService
      .register(this.form.getRawValue())
      .subscribe(() => this.router.navigate(['/login']));
  }
}
