import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { JwtTokensResponseDto } from 'src/auth/dto/jwt-tokens-response.dto';
import { UserService } from 'src/user/user.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private accessTokenOptions: JwtSignOptions;
  private refreshTokenOptions: JwtSignOptions;

  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.accessTokenOptions = {
      expiresIn: process.env.TOKEN_EXPIRE_TIME ?? '1h',
      secret: process.env.JWT_SECRET_KEY ?? 'secret123123',
    };
    this.refreshTokenOptions = {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '24h',
      secret: process.env.JWT_SECRET_REFRESH_KEY ?? 'secret123123',
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const entity = await this.userService.findOneBy({ login: signUpDto.login });
    if (entity) {
      throw new ForbiddenException('user allready exists');
    }
    return await this.userService.create({
      login: signUpDto.login,
      password: signUpDto.password,
    });
  }

  async login(logInDto: LogInDto) {
    const entity = await this.userService.findOneBy({ login: logInDto.login });
    if (!entity) {
      throw new ForbiddenException('no user with such login');
    }

    const isAllowed = await this.userService.verifyPassword(
      logInDto.password,
      entity.password,
    );

    if (!isAllowed) {
      throw new UnauthorizedException("password doesn't match actual done");
    }

    return this.generateTokenPair({ userId: entity.id, login: entity.login });
  }

  async refresh(refreshToken: string) {
    let jwtPayloadDto: JwtPayloadDto;

    try {
      jwtPayloadDto = await this.jwtService.verify(refreshToken, {
        secret: this.refreshTokenOptions.secret,
      });
    } catch (error) {
      console.log('error', error.message);
      if (error.name === 'JsonWebTokenError') {
        throw new ForbiddenException(error);
      }
      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException(error);
      }
    }

    // compare login

    return await this.generateTokenPair({
      userId: jwtPayloadDto.userId,
      login: jwtPayloadDto.login,
    });
  }

  private async generateTokenPair(
    payload: JwtPayloadDto,
  ): Promise<JwtTokensResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, this.accessTokenOptions),
      this.jwtService.signAsync(payload, this.refreshTokenOptions),
    ]);

    return { accessToken, refreshToken };
  }
}
