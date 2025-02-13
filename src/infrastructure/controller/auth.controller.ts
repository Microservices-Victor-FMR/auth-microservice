import { Controller } from '@nestjs/common';
import { RegisterAuthCases } from '../../application/use-cases/auth/register-auth.usecase';
import { RegisterDto } from 'src/application/dtos/register-user.dto';
import { LoginAuthUseCases } from 'src/application/use-cases/auth/login-auth.usecase';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from 'src/application/dtos/login-auth.dto';
import { User } from 'src/core/entities/user.entity';
import { VerifyAccountAuthUseCases } from 'src/application/use-cases/auth/verify-account-auth.usecase';

@Controller()
export class AuthController {
  constructor(
    private readonly registerAuthCases: RegisterAuthCases,
    private readonly loginAuthCases: LoginAuthUseCases,
    private readonly verifyAccountAuthUseCases: VerifyAccountAuthUseCases,
  ) {}

  @MessagePattern('register')
  async register(@Payload() registerDto: RegisterDto) {
    const result = await this.registerAuthCases.execute(registerDto);
    return { message: 'Usuario creado con exito', data: result };
  }

  @MessagePattern('validateUser')
  async validateUser(@Payload() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const result = await this.loginAuthCases.validateUser(email, password);
    return { data: result };
  }

  @MessagePattern('verify-account')
  async verifyAccount(@Payload() payload: any) {
  
    const result = await this.verifyAccountAuthUseCases.execute(payload);
    return { message: 'Cuenta verificada con exito', data: result };
  }

  @MessagePattern('login')
  async login(@Payload() payload: any) {
    const { data } = payload;
    const user = new User(
      data.id,
      data.name,
      data.email,
      data.password_hash,
      data.role,
      data.is_verify,
      data.is_deleted,
      data.created_at,
      data.updated_at,
    );
    const { token } = await this.loginAuthCases.login(user);
    return { message: 'Usuario logueado con exito', token: token };
  }

  @MessagePattern('logout')
  async logout(@Payload() logout: any) {
    return { message: 'Sesión cerrada correctamente' };
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
