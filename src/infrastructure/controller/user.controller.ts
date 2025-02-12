import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
} from '@nestjs/common';
import { FindByIdUserCases } from '../../application/use-cases/user/findById-user.usecase';
import { FindByIdDto } from 'src/application/dtos/findById-user.dto';
import { UpdateUserCases } from '../../application/use-cases/user/update-user.usecase';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { DeleteUserCases } from 'src/application/use-cases/user/delete-user.usecase';
import { FindAllUserCases } from 'src/application/use-cases/user/findAll-user.usecase';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('profile')
export class UserController {
  constructor(
    private readonly findAllUserCases: FindAllUserCases,
    private readonly findByIdUserCases: FindByIdUserCases,
    private readonly updateUserCases: UpdateUserCases,
    private readonly deleteUserCases: DeleteUserCases,
  ) {}

  @MessagePattern('findAllUser')
  async findAll(@Payload() payload) {
    const result = await this.findAllUserCases.execute();
    return { message: 'Usuarios encontrados', data: result };
  }

  @MessagePattern('findOneUser')
  async findOne(@Payload() id: FindByIdDto) {
    const result = await this.findByIdUserCases.execute(id.id);
    return { message: 'Usuario encontrado', data: result };
  }

  @MessagePattern('updateUser')
  async update(@Payload() id: FindByIdDto, @Body() dto: UpdateUserDto) {
    const result = await this.updateUserCases.execute(id.id, dto);
    return { message: 'Usuario actualizado correctamente', data: result };
  }

  @MessagePattern('deleteUser')
  async delete(@Payload() id: FindByIdDto) {
    const result = await this.deleteUserCases.execute(id.id);
    return { message: 'Usuario eliminado de manera exitosa', data: result };
  }
}
