import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FindAllUserCases } from 'src/application/use-cases/user/findAll-user.usecase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    
    private readonly configService: ConfigService,
    private readonly findAllUserCases: FindAllUserCases
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req:Request)=>{
       
         return req?.cookies?.token || null;
      }]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ||'hard!to-guess_secret'
    });
  }
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, roles: payload.role, email:payload.email };
  }
}
