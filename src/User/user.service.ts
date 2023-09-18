import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-user-put.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return this.prisma.user.create({
      data: { ...data, birthAt: data.birthAt ? new Date(data.birthAt) : null },
    });
  }

  async show(id: number) {
    await this.exists(id);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }
  async list() {
    return this.prisma.user.findMany();
  }
  async update(id: number, data: UpdatePutUserDTO) {
    await this.exists(id);
    return this.prisma.user.update({
      data: { ...data, birthAt: data.birthAt ? new Date(data.birthAt) : null },
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
    const idExist = await this.prisma.user.count({
      where: { id },
    });

    if (!!!idExist) {
      throw new NotFoundException(`The user ${id} not exist`);
    }
  }
}
