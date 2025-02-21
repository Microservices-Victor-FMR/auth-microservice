import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from 'src/core/entities/user.entity';
import { UserRepository } from 'src/core/repositories/user.respository';

@Injectable()
export class FindByEmailUserUseCases {
  constructor(@Inject('USER_REPOSITORY') private readonly userRepository: UserRepository) {}

  async verifyEmailExists(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new RpcException({
        message: 'El usuario ya existe',
        statusCode: HttpStatus.CONFLICT,
        microservice: 'Auth',
      });
    }
  }
}
