import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body) {
    return { body };
  }
  @Get()
  async list() {
    return {
      users: [],
    };
  }
  @Get(':id')
  async show(@Param() params) {
    return {
      ...params,
      user: {},
    };
  }
  @Put(':id')
  async updateAll(@Param() params, @Body() body) {
    return {
      method: 'put',
      params,
      body,
    };
  }
  @Patch(':id')
  async update(@Param() params, @Body() body) {
    return {
      method: 'patch',
      params,
      body,
    };
  }
  @Delete(':id')
  async delete(@Param() params) {
    return {
      method: 'delete',
      params,
    };
  }
}
