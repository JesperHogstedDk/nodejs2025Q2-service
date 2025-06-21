import { ApiProperty } from '@nestjs/swagger';

export class JwtTokensResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
