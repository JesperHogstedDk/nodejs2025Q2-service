import { IsString } from 'class-validator';
export class UpdatePasswordDto implements UpdatePasswordDtoInterface {
  @IsString()
  oldPassword: string; // previous password

  @IsString()
  newPassword: string; // new password
}

interface UpdatePasswordDtoInterface {
  oldPassword: string; // previous password
  newPassword: string; // new password
}
