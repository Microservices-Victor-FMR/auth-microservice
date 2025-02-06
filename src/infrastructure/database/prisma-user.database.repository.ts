import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/core/repositories/user.respository';
import { PrismaService } from './prisma.service'; 
import { User } from '../../core/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const founduser = await this.prisma.user.findUnique({ where: { email } });


    return founduser ? new User(
      founduser.id,
      founduser.name,
      founduser.email,
      founduser.password_hash,
      founduser.roles,
      founduser.is_verify,
      founduser.is_deleted,
      founduser.created_at,
      founduser.updated_at,
    ): null
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({});

    return users.map(
      (user) =>
        new User(
          user.id,
          user.name,
          user.email,
          user.password_hash,
          user.roles,
          user.is_verify,
          user.is_deleted,
          user.created_at,
          user.updated_at,
        ),
    );
  }

  async findById(id: string): Promise<User | null> {
    const findOne = await this.prisma.user.findUnique({ where: { id } });

    return findOne
      ? new User(
          findOne.id,
          findOne.name,
          findOne.email,
          findOne.password_hash,
          findOne.roles,
          findOne.is_verify,
          findOne.is_deleted,
          findOne.created_at,
          findOne.updated_at,
        )
      : null;
  }

  async update(user: User): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password_hash: user.getPassword(),
      },
    });

    return new User(
      updateUser.id,
      updateUser.name,
      updateUser.email,
      updateUser.password_hash,
      undefined,
      undefined,
      undefined,
      undefined,
      updateUser.updated_at,
    );
  }

  async delete(id: string): Promise<User> {
    const deleteUser = await this.prisma.user.update({
      where: { id },
      data: { is_deleted: true },
    });

    return deleteUser
      ? new User(
          deleteUser.id,
          deleteUser.name,
          deleteUser.email,
          deleteUser.password_hash,
          deleteUser.roles,
          deleteUser.is_verify,
          deleteUser.is_deleted,
          deleteUser.created_at,
          deleteUser.updated_at,
        )
      : null;
  }
}
