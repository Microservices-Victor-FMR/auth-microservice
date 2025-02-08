import { Controller, Injectable, UseGuards } from '@nestjs/common';
import { RegisterAuthCases } from '../../application/use-cases/auth/register-auth.usecase';
import { RegisterDto } from 'src/application/dtos/register-user.dto';
import { LoginAuthUseCases } from 'src/application/use-cases/auth/login-auth.usecase';
import { LocalAuthGuard } from '../security/guard/autenticación-local.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from 'src/application/dtos/login-auth.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerAuthCases: RegisterAuthCases,
    private readonly loginAuthCases: LoginAuthUseCases,
  ) {}

  @MessagePattern('register')
  async register(@Payload() dto: RegisterDto) {
    const result = await this.registerAuthCases.execute(dto);
    return { message: 'Usuario creado con exito', data: result };
  }

  @MessagePattern('login')
  @UseGuards(LocalAuthGuard)
  async login(@Payload() login: LoginDto) {
    const { token } = await this.loginAuthCases.login(login);
    return { message: 'Usuario logueado con exito', token: token };
  }

  @MessagePattern('logout')
  async logout(@Payload() logout: any) {
    return { message: 'Logout Exitoso' };
  }

  @MessagePattern('reset-password')
  async resetPassword(@Payload() resetPassword: any) {
    return { message: 'Enlace de restablecimiento enviado a tu correo' };
  }

  @MessagePattern('update-password')
  async updatePassword(@Payload() updatePassword: any) {
    return { message: 'Contraseña actualizada con éxito' };
  }
}
