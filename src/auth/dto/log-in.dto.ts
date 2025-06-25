import { IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  public login: string;

  @IsString()
  public password: string;
}
