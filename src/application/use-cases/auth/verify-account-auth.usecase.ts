import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { AuthRepository } from 'src/core/repositories/auth.repository';
import { AUTH_REPOSITORY } from 'src/token.contants';

@Injectable()
export class VerifyAccountAuthUseCases {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token);

      const userId = payload.sub;

      return await this.authRepository.verifyAccount(userId);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new RpcException({
          message: 'Token inválido o expirado',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
      throw new RpcException({
        message: 'Error al verificar cuenta',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
