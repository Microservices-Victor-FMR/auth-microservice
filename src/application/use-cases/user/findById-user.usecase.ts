import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity'; 
import { UserRepository } from 'src/core/repositories/user.respository'; 
import { USER_REPOSITORY } from 'src/token.contants';


@Injectable()
export class FindByIdUserCases {
  constructor(@Inject(USER_REPOSITORY)private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const  findUser = await this.userRepository.findById(id);

    if(!findUser){
        throw new BadRequestException('Usuario no encontrado')
    }
    return await this.userRepository.findById(id);
  }
}
