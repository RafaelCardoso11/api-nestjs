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
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  private audience = 'users';
  private issuer = 'login';

  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
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

  verifyToken(token: string) {
    try {
      const data = this.JWTService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data;
    } catch (error) {
      throw new BadRequestException('Token Invalid');
    }
  }

  async login({ email, password }: AuthLoginDTO) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        const token = this.createToken(user);
        return { token, ...user };
      }
    } catch (error) {
      throw new UnauthorizedException('Email e/ou senha incorretos');
    }
  }

  async forget(data: AuthForgetDTO) {
    const user = await this.prisma.user.findFirst({ where: data });

    if (!user) {
      throw new UnauthorizedException('Email incorreto');
    }

    //TODO: Enviar o e-mail
    return true;
  }

  async resetPassword({ password, id }: AuthResetPasswordDTO) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password,
      },
    });

    const newToken = this.createToken(user);

    return { token: newToken, ...user };
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    const token = this.createToken(user);
    return {
      token,
    };
  }
}
