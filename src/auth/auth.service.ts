import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { JwtTokensResponseDto } from 'src/auth/dto/jwt-tokens-response.dto';


@Injectable()
export class AuthService {
  private accessTokenOptions: JwtSignOptions;
  private refreshTokenOptions: JwtSignOptions;
  constructor(
    private usersService: UserService,
    private jwtService: JwtService) {
    this.accessTokenOptions = {
      expiresIn: process.env.TOKEN_EXPIRE_TIME ?? '1h',
      secret: process.env.JWT_SECRET_KEY ?? 'secret123123',
    };
    this.refreshTokenOptions = {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '24h',
      secret: process.env.JWT_SECRET_REFRESH_KEY ?? 'secret123123',
    };
  }

  async generateTokenPair(
    payload: JwtPayloadDto,
  ): Promise<JwtTokensResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, this.accessTokenOptions),
      this.jwtService.signAsync(payload, this.refreshTokenOptions),
    ]);

    return { accessToken, refreshToken };
  }


  // async signIn(username: string, pass: string): Promise<any> {
  //   console.log("signIn action return a new accesstoken.")
  //   const user = await this.usersService.findOneByName(username);
  //   if (user?.password! == pass) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = { sub: user.id, username: user.login };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }
}
