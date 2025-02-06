import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginAuthUseCases } from 'src/application/use-cases/auth/login-auth.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginAuthUseCases: LoginAuthUseCases) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.loginAuthUseCases.validateUser(email, password);
    if (!user) {
        throw new UnauthorizedException();
      }
    return user;
  }
}
