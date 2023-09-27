import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const UserByRequest = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new NotFoundException('Usuário não encontrado na request.');
    }
    return request.user;
  },
);
