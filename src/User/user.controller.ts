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
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-user-put.dto';
import { UpdatePatchUserDTO } from './dto/update-user-patch.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async list() {
    return {
      users: [],
    };
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id) {
    return {
      id,
      user: {},
    };
  }

  @Post()
  async create(@Body() { name, password, email }: CreateUserDTO) {
    return this.userService.create({ name, password, email });
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() body: UpdatePutUserDTO) {
    return {
      id,
      body,
      method: 'PUT',
    };
  }

  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id,
    @Body() body: UpdatePatchUserDTO,
  ) {
    return {
      id,
      body,
      method: 'PATCH',
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return { id };
  }
}
