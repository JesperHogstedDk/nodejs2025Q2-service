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
  Put
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = this.usersService.findOne(id);
    if (user) {
      return user;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @Put(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
      throw new ForbiddenException('Both old and new passwords must be provided');
    }
    const user = this.usersService.update(id, updatePasswordDto);
    if (user) {
      return user;
    }
    if (user === null) {
      throw new ForbiddenException(`User with id ${id} old password does not match`);
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const foundAndDeleted = this.usersService.remove(id);
    if (foundAndDeleted) {
      return;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }
}
