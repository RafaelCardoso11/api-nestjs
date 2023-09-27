import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const UserByRequest = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new NotFoundException('Usuário não encontrado na request.');
    }

    if (filter) {
      return request.user[filter];
    }

    return request.user;
  },
);
