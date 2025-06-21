import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  public login: string;

  @IsString()
  public password: string;
}
