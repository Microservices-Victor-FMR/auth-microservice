import {
  Body,
  Controller,
  Injectable,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterAuthCases } from '../../application/use-cases/auth/register-auth.usecase';
import { RegisterDto } from 'src/application/dtos/register-user.dto';
import { LoginAuthUseCases } from 'src/application/use-cases/auth/login-auth.usecase';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../security/guard/autenticación-local.guard';
import { Request } from 'express';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerAuthCases: RegisterAuthCases,
    private readonly loginAuthCases: LoginAuthUseCases,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.registerAuthCases.execute(dto);
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user;
    return { message: 'Login Exitoso', user };
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
  
    return { message: 'Logout Exitoso' };
  }
}
