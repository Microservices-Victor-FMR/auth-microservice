import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { UserRepository } from 'src/core/repositories/user.respository';
import { USER_REPOSITORY } from 'src/token.contants';

@Injectable()
export class DeleteUserUseCases {
  constructor(
    @Inject(USER_REPOSITORY) private readonly useRepository: UserRepository,
  ) {}
  async execute(id: string): Promise<User> {
    const findUser = await this.useRepository.findById(id);
    if (!findUser) {
      throw new BadRequestException('Usuario no existe');
    }

    return await this.useRepository.delete(id);
  }
}
