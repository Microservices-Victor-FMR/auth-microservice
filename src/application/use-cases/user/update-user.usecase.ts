import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { USER_REPOSITORY } from 'src/token.contants';
import { UserRepository } from 'src/core/repositories/user.respository';
@Injectable()
export class UpdateUserCases {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const findUser = await this.userRepository.findById(id);
    if (!findUser) {
      throw new NotFoundException('El usuario no existe');
    }

    const updatedUser = new User(
      findUser.id,
      dto.name ?? findUser.name,
      dto.email ?? findUser.email,
      dto.password ?? findUser.getPassword(),
      findUser.role,
      findUser.is_verify,
      findUser.is_deleted,
      findUser.created_at,
      new Date(),
    );

    return await this.userRepository.update(updatedUser);
  }
}
