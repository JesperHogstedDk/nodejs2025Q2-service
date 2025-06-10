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
  async create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new ForbiddenException('Username and password are required fields');
    }
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.findOne(id);
    if (user) {
      return user;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!(await this.userService.findOne(id))) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
      throw new ForbiddenException(
        'Both old and new passwords must be provided',
      );
    }

    const user = await this.userService.update(id, updatePasswordDto);
    if (user) {
      return user;
    }
    if (user === null) {
      throw new ForbiddenException(
        `User with id ${id} old password does not match`,
      );
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const foundAndDeleted = await this.userService.remove(id);
    if (foundAndDeleted) {
      return;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }
}
