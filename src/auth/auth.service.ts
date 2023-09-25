import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetPasswordDTO } from './dto/auth-reset-password.dto';
import { User } from '@prisma/client';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private audience = 'users';
  private issuer = 'login';

  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User) {
    return this.JWTService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      {
        expiresIn: '7 days',
        subject: user.id.toString(),
        audience: this.audience,
        issuer: this.issuer,
      },
    );
  }

  async verifyToken(token: string) {
    try {
      const data = this.JWTService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Token Invalid');
    }
  }

  async login(data: AuthLoginDTO) {
    const user = await this.prisma.user.findFirst({ where: data });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorretos');
    }

    const token = await this.createToken(user);
    return { token, ...user };
  }

  async forget(data: AuthForgetDTO) {
    const user = await this.prisma.user.findFirst({ where: data });

    if (!user) {
      throw new UnauthorizedException('Email incorreto');
    }

    //TODO: Enviar o e-mail
    return true;
  }

  async resetPassword({ password, token }: AuthResetPasswordDTO) {
    const dataToken = await this.verifyToken(token);
    const idUser = dataToken.id;
    const user = await this.prisma.user.update({
      where: { id: idUser },
      data: {
        password,
      },
    });

    const newToken = await this.createToken(user);

    return { token: newToken, ...user };
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
