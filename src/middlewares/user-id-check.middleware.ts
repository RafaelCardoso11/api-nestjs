import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    const notIsNumber = isNaN(id);
    const isLessThanOne = id < 1;

    if (notIsNumber || isLessThanOne) {
      throw new BadRequestException('ID invalid!');
    }

    next();
  }
}
