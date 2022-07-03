import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'src/app/interfaces/role';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  form!: FormGroup;
  roles: Role[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      roleId: '',
    });

    this.roleService.all().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  submit(): void {
    this.userService
      .create(this.form.getRawValue())
      .subscribe(() => this.router.navigate(['/users']));
  }
}
