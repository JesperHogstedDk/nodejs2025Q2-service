import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokensResponseDto } from 'src/auth/dto/jwt-tokens-response.dto';
import { LogInDto } from 'src/auth/dto/log-in.dto';
import { LogService } from 'src/log/log.service';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LogService,
  ) {
    logger.setContext('AuthController');
  }

  @Public()
  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    this.logger.log('This signup action signup a new user');
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LogInDto): Promise<JwtTokensResponseDto> {
    this.logger.log('This login action login a user');
    return await this.authService.login(loginDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string },
  ): Promise<JwtTokensResponseDto> {
    if (!body.refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    this.logger.log(
      `This refresh: ${body.refreshToken.substring(0, 12)}... action return new tokens`,
    );

    return await this.authService.refresh(body.refreshToken);
  }
}
