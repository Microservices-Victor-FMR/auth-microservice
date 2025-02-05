import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module'; 
import { AuthController } from './infrastructure/controller/auth.controller';
import { PrismaUserRepository } from './infrastructure/database/prisma-user.database.repository';
import { PrismaService } from './infrastructure/database/prisma.service'; 
import { AUTH_REPOSITORY, USER_REPOSITORY } from './token.contants';
import { Bcrypt } from './infrastructure/security/bcrypt.security';
import { DeleteUserCases } from './application/use-cases/user/delete-user.usecase';
import { FindAllUserCases } from './application/use-cases/user/findAll-user.usecase';
import { RegisterAuthCases } from './application/use-cases/auth/register-auth.usecase';
import { FindByIdUserCases } from './application/use-cases/user/findById-user.usecase';
import { UpdateUserCases } from './application/use-cases/user/update-user.usecase';
import { PrismaAuthRepository } from './infrastructure/database/prisma-auth.database.repository';
import { UserController } from './infrastructure/controller/user.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
    }),
  ],
  controllers: [AuthController,UserController],
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
    FindAllUserCases,
    FindByIdUserCases,
    UpdateUserCases,
    DeleteUserCases,
  ],
})
export class AppModule {}
