import { User } from "../entities/user.entity";

export interface UserRepository{
      
      findByEmail(email:string):Promise<User|null >
      findAll(): Promise<User[]>;
      findById(id: string): Promise<User | null>;
      update(user: User): Promise<User>;
      delete(id: string): Promise<User>;
}