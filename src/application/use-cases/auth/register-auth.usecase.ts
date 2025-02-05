import { User } from 'src/core/entities/user.entity';
import { RegisterDto } from '../../dtos/register-user.dto';
import { UserRepository } from 'src/core/repositories/user.respository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY, USER_REPOSITORY } from 'src/token.contants'; 
import { Bcrypt } from '../../../infrastructure/security/bcrypt.security';
import { AuthRepository } from 'src/core/repositories/auth.repository';
@Injectable()
export class RegisterAuthCases {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,    
    private readonly bcrypt: Bcrypt,) {}

  async execute(dto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('El usuario ya existe')
    }
     
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden')
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
      new Date,
      new Date
    );
    
    return await this.authRepository.register(newUser);
  }
}
