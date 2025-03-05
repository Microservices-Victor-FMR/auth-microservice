import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from 'src/core/entities/user.entity';
import { UserRepository } from 'src/core/repositories/user.respository';
import { USER_REPOSITORY } from '../../../token.contants';

@Injectable()
export class FindAllUserUseCases {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}
  async execute(): Promise<User[]> {
    const AllUser = await this.userRepository.findAll();
    if (!AllUser || AllUser.length === 0) {
      throw new RpcException({
        message: 'No hay usuarios registrados',
        statusCode: HttpStatus.OK,
        microservice: 'Auth',
      });
    }
    return AllUser;
  }
}
