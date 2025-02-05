import { IsNotEmpty, IsString } from 'class-validator';

export class FindByIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
