import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthRepository } from 'src/core/repositories/auth.repository';
import { UserRepository } from 'src/core/repositories/user.respository';
import { AUTH_REPOSITORY, USER_REPOSITORY } from 'src/token.contants';

@Injectable()
export class ResendVerifyEmailAuthUseCases {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    @Inject('NATS_SERVICE') private readonly nats_authentication: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (user.is_verify === true) {
        throw new RpcException({ message: 'El email ya ha sido verificado', statusCode: HttpStatus.OK, microservice: 'Auth' });
      }
      const payload = { sub: user.id, name: user.name, email: user.email };

      const token = this.jwtService.sign(payload, { expiresIn: '20m' });

      this.nats_authentication.emit('user_resend_email', { payload, token: token });
      return null;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new RpcException({
          message: 'Token invalido o expirado',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
      throw new RpcException({
        message: 'Error al por parte del servidor',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
