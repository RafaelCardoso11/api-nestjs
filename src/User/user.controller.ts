import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-user-put.dto';
import { UpdatePatchUserDTO } from './dto/update-user-patch.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { HashPipe } from 'src/pipes/hash.pipe';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id) {
    return this.userService.show(id);
  }

  @Post()
  async create(@Body(new HashPipe('password')) body: CreateUserDTO) {
    return this.userService.create(body);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() body: UpdatePutUserDTO) {
    return this.userService.update(id, body);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id,
    @Body(new HashPipe('password'))
    { email, birthAt, name, password, role }: UpdatePatchUserDTO,
  ) {
    return this.userService.update(id, {
      email,
      birthAt,
      name,
      password,
      role,
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return this.userService.delete(id);
  }
}
