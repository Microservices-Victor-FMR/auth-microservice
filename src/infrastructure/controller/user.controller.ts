import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FindByIdUserCases } from '../../application/use-cases/user/findById-user.usecase';
import { FindByIdDto } from 'src/application/dtos/findById-user.dto';
import { UpdateUserCases } from '../../application/use-cases/user/update-user.usecase';
import { UpdateUserDto } from 'src/application/dtos/update-user.dto';
import { DeleteUserCases } from 'src/application/use-cases/user/delete-user.usecase';
import { FindAllUserCases } from 'src/application/use-cases/user/findAll-user.usecase';
import { JwtAuthGuard } from '../security/guard/jwt-auth.guard';
import { Request } from 'express';

@Injectable()
@Controller('profile')
export class UserController {
  constructor(
    private readonly findAllUserCases: FindAllUserCases,
    private readonly findByIdUserCases: FindByIdUserCases,
    private readonly updateUserCases: UpdateUserCases,
    private readonly deleteUserCases: DeleteUserCases,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request) {
    return await this.findAllUserCases.execute(req.user);
  }

  @Get('/:id')
  async findOne(@Param() dto: FindByIdDto) {
    const result = await this.findByIdUserCases.execute(dto.id);
    return result;
  }

  @Patch('/:id')
  async update(@Param() id: FindByIdDto, @Body() dto: UpdateUserDto) {
    const result = await this.updateUserCases.execute(id.id, dto);
    return { message: 'User updated successfully', data: result };
  }

  @Delete('/:id')
  async delete(@Param() id: FindByIdDto) {
    const result = await this.deleteUserCases.execute(id.id);
    return { message: 'User deleted successfully', data: result };
  }
}
