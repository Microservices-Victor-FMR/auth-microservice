import {
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { User } from 'src/core/entities/user.entity';
import { AuthRepository } from 'src/core/repositories/auth.repository';
import { UserRepository } from 'src/core/repositories/user.respository';
import { Bcrypt } from 'src/infrastructure/security/bcrypt.security';
import { AUTH_REPOSITORY, USER_REPOSITORY } from 'src/token.contants';

@Injectable()
export class LoginAuthUseCases {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly bcrypt: Bcrypt,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) 
      throw new RpcException({message:'El Usuario no existe',statusCode:HttpStatus.NOT_FOUND,microservice:'Auth'});
   
    const isPasswordValid = await this.bcrypt.comparePassword(
      password,
      user.getPassword(),
    );

    if (!isPasswordValid)
      throw new RpcException({message:'Contraseña Invalida', statusCode: HttpStatus.BAD_REQUEST,microservice:'Auth'});

    return user;
  }

  async login(user:User) {
    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { token: token };
  }
}
