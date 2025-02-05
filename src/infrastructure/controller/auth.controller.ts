import {
  Body,
  Controller,
  Injectable,
  Post,
} from '@nestjs/common';
import { RegisterAuthCases } from '../../application/use-cases/auth/register-auth.usecase';
import { RegisterDto } from 'src/application/dtos/register-user.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private readonly registerAuthCases: RegisterAuthCases) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.registerAuthCases.execute(dto);
    return result;
  }
}
