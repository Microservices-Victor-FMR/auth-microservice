import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthController } from './infrastructure/controller/auth.controller';
import { PrismaUserRepository } from './infrastructure/database/prisma-user.database.repository';
import { PrismaService } from './infrastructure/database/prisma.service';
import { AUTH_REPOSITORY, USER_REPOSITORY } from './token.contants';
import { Bcrypt } from './infrastructure/security/bcrypt.security';
import { DeleteUserUseCases } from './application/use-cases/user/delete-user.usecase';
import { FindAllUserUseCases } from './application/use-cases/user/findAll-user.usecase';
import { RegisterAuthCases } from './application/use-cases/auth/register-auth.usecase';
import { FindByIdUserUseCases } from './application/use-cases/user/findById-user.usecase';
import { UpdateUserUseCases } from './application/use-cases/user/update-user.usecase';
import { PrismaAuthRepository } from './infrastructure/database/prisma-auth.database.repository';
import { UserController } from './infrastructure/controller/user.controller';
import { LoginAuthUseCases } from './application/use-cases/auth/login-auth.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TransportNatsModule } from './infrastructure/messaging/transport.module';
import { VerifyAccountAuthUseCases} from './application/use-cases/auth/verify-account-auth.usecase';
import { ResendVerifyEmailAuthUseCases } from './application/use-cases/auth/resend-verify-email-auth.usecase';
import {FindByEmailUserUseCases } from './application/use-cases/user/findByEmail-user.usecase';
import { ChangedEmailUserUseCases } from './application/use-cases/user/changedEmail-user.usecases';
import { UpdateEmailUserUseCases } from './application/use-cases/user/updateEmail-user.usecase';

@Module({
  imports: [
    TransportNatsModule,
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret:configService.get<string>('JWT_SECRET') || 'hard!to-guess_secret',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    PrismaService,
    Bcrypt,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository,
    },
    RegisterAuthCases,
    VerifyAccountAuthUseCases,
    ResendVerifyEmailAuthUseCases,
    FindByEmailUserUseCases,
    LoginAuthUseCases,
    FindAllUserUseCases,
    FindByIdUserUseCases,
    UpdateUserUseCases,
    ChangedEmailUserUseCases,
    UpdateEmailUserUseCases,
    DeleteUserUseCases,
  ],
})
export class AppModule {}
