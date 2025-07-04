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
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './auth.decorator';
import { LogService } from 'src/log/log.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LogService
  ) {
    logger.setContext('AuthController');
  }

  @Public()
  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    this.logger.log('This action signup a new user');
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LogInDto): Promise<JwtTokensResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string },
  ): Promise<JwtTokensResponseDto> {
    // console.log('refresh: ', body.refreshToken);
    this.logger.log(`refresh: ${body.refreshToken}`)
    if (!body.refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    return await this.authService.refresh(body.refreshToken);
  }
}
