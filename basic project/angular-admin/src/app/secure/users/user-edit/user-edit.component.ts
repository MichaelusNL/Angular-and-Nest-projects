import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  form!: FormGroup;
  roles: Role[] = [];
  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
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

    this.id = this.route.snapshot.params['id'];

    this.userService.get(this.id).subscribe((user: User) => {
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.role.id,
      });
    });
  }

  submit(): void {
    this.userService.update(this.id, this.form.getRawValue()).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
}
