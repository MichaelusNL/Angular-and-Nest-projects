import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/permission';
import { Role } from 'src/app/interfaces/role';
import { PermissionService } from 'src/app/services/permission.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css'],
})
export class RoleEditComponent implements OnInit {
  form!: FormGroup;
  permissions: Permission[] = [];
  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      permissions: this.formBuilder.array([]),
    });

    this.permissionService.all().subscribe((permissions) => {
      this.permissions = permissions;
      this.permissions.forEach((permission) => {
        this.permissionArray.push(
          this.formBuilder.group({ value: false, id: permission.id })
        );
      });
    });

    this.id = this.route.snapshot.params['id'];

    this.roleService.get(this.id).subscribe((role: Role) => {
      const values = this.permissions.map((p) => {
        return { value: role.permissions.find((r) => r.id === p.id), id: p.id };
      });

      this.form.patchValue({
        name: role.name,
        permissions: values,
      });
    });
  }

  get permissionArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  submit(): void {
    const formData = this.form.getRawValue();
    const data = {
      name: formData.name,
      permissions: formData.permissions
        .filter((permission: any) => permission.value == true)
        .map((permission: any) => permission.id),
    };

    this.roleService.update(this.id, data).subscribe(() => {
      this.router.navigate(['/roles']);
    });
  }
}
