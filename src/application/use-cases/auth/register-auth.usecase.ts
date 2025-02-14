import { User } from 'src/core/entities/user.entity';
import { RegisterDto } from '../../dtos/register-user.dto';
import { UserRepository } from 'src/core/repositories/user.respository';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY, USER_REPOSITORY } from 'src/token.contants';
import { Bcrypt } from '../../../infrastructure/security/bcrypt.security';
import { AuthRepository } from 'src/core/repositories/auth.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class RegisterAuthCases {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject('NATS_SERVICE') private readonly nats_authentication: ClientProxy,
    private readonly bcrypt: Bcrypt,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<User | string> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new RpcException({
        message: 'El usuario ya existe',
        statusCode: HttpStatus.FOUND,
        microservice: 'Auth',
      });
    }

    if (dto.password !== dto.confirmPassword) {
      throw new RpcException({
        message: 'Las contraseñas no coinciden',
        statusCode: HttpStatus.BAD_REQUEST,
        microservice: 'Auth',
      });
    }

    const hash = await this.bcrypt.hashPassword(dto.password);

    const newUser = new User(
      undefined,
      dto.name,
      dto.email,
      hash,
      'user',
      false,
      false,
      new Date(),
      new Date(),
    );

    const savedUser = await this.authRepository.register(newUser);

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      username: savedUser.name,
      role: savedUser.role,
    };

    if (
      !('sub' in payload) ||
      !('username' in payload) ||
      !('email' in payload) ||
      !('role' in payload)
    ) {
      throw new RpcException({
        message: 'Error inesperado por parte del servidor',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        microservice: 'Auth',
      });
    }

    const token = this.jwtService.sign(payload);

    this.nats_authentication.emit('user_created', {
      userId: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      token,
    });
    return token;
  }
}
