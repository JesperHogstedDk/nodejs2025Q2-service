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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      return await this.userService.create(signUpDto);

    } catch (error) { }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignUpDto) {
    console.log('login: ', signInDto.login  )
    return this.authService.signIn(signInDto.login, signInDto.password);
  }
}


