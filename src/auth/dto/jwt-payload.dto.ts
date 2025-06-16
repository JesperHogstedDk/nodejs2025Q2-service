import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  login: string;
}
