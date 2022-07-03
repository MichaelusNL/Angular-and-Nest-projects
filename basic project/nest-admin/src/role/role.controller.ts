import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HasPermission } from '../permission/has-permission.decorator';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @HasPermission('Roles')
  async all() {
    return await this.roleService.all();
  }

  @Post()
  @HasPermission('Roles')
  async create(
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ): Promise<Role> {
    return await this.roleService.create({
      name,
      permissions: ids.map((id) => ({
        id,
      })),
    });
  }

  @Get(':id')
  @HasPermission('Roles')
  async get(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne({ id }, ['permissions']);
  }

  @Put(':id')
  @HasPermission('Roles')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ): Promise<Role> {
    await this.roleService.update(id, {
      name,
    });

    const role = await this.roleService.findOne(id);

    return this.roleService.create({
      ...role,
      permissions: ids.map((id) => ({
        id,
      })),
    });
  }

  @Delete(':id')
  @HasPermission('Roles')
  async delete(@Param('id') id: number): Promise<Role> {
    return this.roleService.delete(id);
  }
}
