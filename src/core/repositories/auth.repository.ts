import { User } from '../entities/user.entity';

export interface AuthRepository {
  register(user:User): Promise<User>;
  login(user:User): Promise<User>;
}
