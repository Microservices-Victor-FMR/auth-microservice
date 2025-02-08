import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { UserRepository } from 'src/core/repositories/user.respository';
import { USER_REPOSITORY } from 'src/token.contants';

@Injectable()
export class FindAllUserCases {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}
  async execute(): Promise<User[]> {
    const AllUser = await this.userRepository.findAll();
    if (!AllUser || AllUser.length === 0) {
      throw new NotFoundException('No hay usuarios Registrados');
    }
    return AllUser;
  }
}
