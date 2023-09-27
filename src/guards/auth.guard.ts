import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const headers = request.headers;
    const { authorization } = headers;
    const token = (authorization ?? '').split(' ')[1];

    const tokenPayload = this.authService.verifyToken(token);

    if (tokenPayload) {
      request.tokenPayload = tokenPayload;
    }
    return tokenPayload;
  }
}
