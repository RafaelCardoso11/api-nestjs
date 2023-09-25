import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetPasswordDTO } from './dto/auth-reset-password.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/login')
  async login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('/register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('/forget')
  async forget(@Body() body: AuthForgetDTO) {
    return this.authService.forget(body);
  }

  @Post('/resetpassword')
  async resetPassword(@Body() body: AuthResetPasswordDTO) {
    return this.authService.resetPassword(body);
  }
  @Post('/me')
  async me(@Body() body) {
    return this.authService.verifyToken(body.token);
  }
}
