import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new ForbiddenException('Username and password are required fields');
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = this.userService.findOne(id);
    if (user) {
      return user;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
      throw new ForbiddenException(
        'Both old and new passwords must be provided',
      );
    }
    const user = this.userService.update(id, updatePasswordDto);
    if (user) {
      return user;
    }
    if (user === null) {
      throw new ForbiddenException(
        `User with id ${id} old password does not match`,
      );
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const foundAndDeleted = this.userService.remove(id);
    if (foundAndDeleted) {
      return;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }
}
