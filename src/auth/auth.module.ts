import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: `Cx5Aw|}5G_'_j]Tf9T~6jo<$(8335W19`,
    }),
    UserModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
