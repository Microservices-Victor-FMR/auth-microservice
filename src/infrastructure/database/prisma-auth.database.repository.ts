import { Injectable } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { AuthRepository } from 'src/core/repositories/auth.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}


  async register(user: User): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password_hash: user.getPassword(),
        is_verify: user.is_verify,
        is_deleted: user.is_deleted,
        roles: 'USER',
      },
    });

    return new User(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password_hash,
      newUser.roles,
      newUser.is_verify,
      newUser.is_deleted,
      newUser.created_at,
      newUser.updated_at,
    );
  }



  login(user: User): Promise<User> {
      return
  }
}
