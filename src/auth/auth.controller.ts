import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { LogInDto } from 'src/auth/dto/log-in.dto';
import { JwtTokensResponseDto } from 'src/auth/dto/jwt-tokens-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    const entity = await this.userService.findOneByName(signUpDto.login);
    if (entity) {
      throw new ForbiddenException('user allready exists');
    }
    try {
      return await this.userService.create(signUpDto);
    } catch (error) {}
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LogInDto): Promise<JwtTokensResponseDto> {
    const { login, password } = loginDto;

    const entity = await this.userService.findOneByName(login);

    if (!entity) {
      throw new ForbiddenException('no user with such login');
    }

    const isAllowed = await this.userService.verifyPassword(
      password,
      entity.password,
    );

    if (!isAllowed) {
      throw new ForbiddenException("password doesn't match actual one");
    }

    const payload = { userId: entity.id, login: entity.login };

    return this.authService.generateTokenPair(payload);
  }
}
