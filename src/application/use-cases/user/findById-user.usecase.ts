import {HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from 'src/core/entities/user.entity';
import { UserRepository } from 'src/core/repositories/user.respository';
import { USER_REPOSITORY } from '../../../token.contants';

@Injectable()
export class FindByIdUserUseCases {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const findUser = await this.userRepository.findById(id);
    if (!findUser) {
      throw new RpcException({
        message: 'Usuario no encontrado',
        statusCode: HttpStatus.NOT_FOUND,
        microservice: 'Auth',
      });
    }
    return findUser;
  }
}
