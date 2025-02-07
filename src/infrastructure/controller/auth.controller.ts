import {
  Body,
  Controller,
  Injectable,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterAuthCases } from '../../application/use-cases/auth/register-auth.usecase';
import { RegisterDto } from 'src/application/dtos/register-user.dto';
import { LoginAuthUseCases } from 'src/application/use-cases/auth/login-auth.usecase';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../security/guard/autenticación-local.guard';
import { Request,Response } from 'express';
import { User } from 'src/core/entities/user.entity';
import { JwtAuthGuard } from '../security/guard/jwt-auth.guard';
import { json } from 'stream/consumers';

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
  async login(@Req() req: Request, @Res()res:Response) {

    const result = await this.loginAuthCases.login(req.user)
    res.cookie('token',result.token, { httpOnly: true })
    return res.json({ message: 'Login Exitoso'});
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
   logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.json({message:"Logout Exitoso"})
  }

}
