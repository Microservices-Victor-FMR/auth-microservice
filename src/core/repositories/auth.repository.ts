import { User } from '../entities/user.entity';

export interface AuthRepository {
  register(user: User): Promise<User>;
  verifyAccount(userId: string): Promise<string>;
  login(user: User): Promise<User>;
}
