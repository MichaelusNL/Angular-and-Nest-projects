import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dto/user-create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { HasPermission } from '../permission/has-permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('Users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Put('info')
  async updateInfo(@Body() body: UserUpdateDto, @Req() request: Request) {
    const id = await this.authService.userId(request);

    await this.userService.update(id, body);

    return this.userService.findOne(id);
  }

  @Put('password')
  async updatePassword(
    @Body('password') password: string,
    @Body('passwordConfirm') passwordConfirm: string,
    @Req() request: Request,
  ) {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const id = await this.authService.userId(request);

    const hashed = await bcrypt.hash(password, 12);

    await this.userService.update(id, {
      password: hashed,
    });

    return this.userService.findOne(id);
  }

  @Get()
  @HasPermission('Users')
  all(@Query('page') page = 1) {
    return this.userService.paginate(page, ['role']);
  }

  @Post()
  @HasPermission('Users')
  async create(@Body() body: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12);

    const { roleId, ...data } = body;

    return this.userService.create({
      ...data,
      password,
      role: roleId,
    } as any);
  }

  @Get(':id')
  @HasPermission('Users')
  async get(@Param('id') id: string): Promise<User> {
    return this.userService.findOne({ id }, ['role']);
  }

  @Put(':id')
  @HasPermission('Users')
  async update(
    @Param('id') id: number,
    @Body() body: UserUpdateDto,
  ): Promise<User> {
    const { roleId, ...data } = body;

    await this.userService.update(id, {
      ...data,
      role: roleId,
    });

    return this.userService.findOne(id);
  }

  @Delete(':id')
  @HasPermission('Users')
  async delete(@Param('id') id: number): Promise<User> {
    return this.userService.delete(id);
  }
}
