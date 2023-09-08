import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-user-put.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return this.prisma.user.create({
      data,
    });
  }

  async show(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async list() {
    return this.prisma.user.findMany();
  }
  async update(id: number, data: UpdatePutUserDTO) {
    await this.exists(id);
    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async exists(id: number) {
    if (!(await this.show(id))) {
      throw new NotFoundException(`The user ${id} not exist`);
    }
  }
}
