import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { FindByIdUserUseCases } from '../../application/use-cases/user/findById-user.usecase';
import { FindByIdDto } from 'src/application/dtos/findById-user.dto';
import { UpdateUserUseCases } from '../../application/use-cases/user/update-user.usecase';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { DeleteUserUseCases } from 'src/application/use-cases/user/delete-user.usecase';
import { FindAllUserUseCases } from 'src/application/use-cases/user/findAll-user.usecase';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangedEmailUserUseCases } from 'src/application/use-cases/user/changedEmail-user.usecases';

@Controller()
export class UserController {
  constructor(
    private readonly findAllUserUseCases: FindAllUserUseCases,
    private readonly findByIdUserUseCases: FindByIdUserUseCases,
    private readonly updateUserUseCases: UpdateUserUseCases,
    private readonly deleteUserUseCases: DeleteUserUseCases,
    private readonly changedEmailUserUseCases: ChangedEmailUserUseCases,
  ) {}

  @MessagePattern('findAllUser')
  async findAll(@Payload() payload: any) {
    const result = await this.findAllUserUseCases.execute();
    return { message: 'Usuarios encontrados', data: result };
  }

  @MessagePattern('findOneUser')
  async findOne(@Payload() id: FindByIdDto) {
    const result = await this.findByIdUserUseCases.execute(id.id);
    return { message: 'Usuario encontrado', data: result };
  }

  @MessagePattern('updateUser')
  async update(@Payload() payload: { id: FindByIdDto; updateUserDto: UpdateUserDto }) {
    const { id, updateUserDto } = payload;
    const result = await this.updateUserUseCases.execute(id.id, updateUserDto);
    return result;
  }

  @MessagePattern('changedEmailToken')
  async changedEmailToken(@Payload() payload: any) {
    const { token } = payload;
    const result = await this.changedEmailUserUseCases.execute(token);
    return result;
  }

  @MessagePattern('deleteUser')
  async delete(@Payload() id: FindByIdDto) {
    const result = await this.deleteUserUseCases.execute(id.id);
    return { message: 'Usuario eliminado de manera exitosa', data: result };
  }
}
