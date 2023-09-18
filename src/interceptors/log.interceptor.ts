import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dtBefore = Date.now();

    return next.handle().pipe(
      tap(() => {
        const dtAfter = Date.now();

        const { method, url }: Request = context.switchToHttp().getRequest();

        console.log(
          `| ${method} - ${url} | execução na rota levou: ${
            dtAfter - dtBefore
          } milisegundos`,
        );
      }),
    );
  }
}
