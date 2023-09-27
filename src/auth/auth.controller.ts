import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetPasswordDTO } from './dto/auth-reset-password.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserByRequest } from 'src/decorators/user-by-request.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @UseGuards(AuthGuard)
  @Post('/verifyToken')
  async me(@UserByRequest() user) {
    return {
      user,
    };
  }
}
