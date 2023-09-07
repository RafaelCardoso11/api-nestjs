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
import { CreateUserDTO } from './dto/create.dto';
import { UpdatePutUserDTO } from './dto/update-put.dto';
import { UpdatePatchUserDTO } from './dto/update-patch.dto';

@Controller('users')
export class UserController {
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
  async create(@Body() { email, name, password }: CreateUserDTO) {
    return { email, name, password };
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
