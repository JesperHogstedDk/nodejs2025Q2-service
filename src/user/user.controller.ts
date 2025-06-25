import {
  BadRequestException,
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
import { User } from './entities/user.entity';
import { QueryFailedError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';

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
    // try {
    //   const entity = await this.userService.create(createUserDto);
    //   if (entity) {
    //     return entity;
    //   }
    // } catch (error) {
    //   // if (error.code === "23502") {
    //   //   return new BadRequestException('This login is not null')
    //   // }
    //   // if (error.code === "23505") {
    //   //   return new BadRequestException('This login is not unique')
    //   // }
    //   // if (error.detail?.includes('already exists')) {
    //   //   return new BadRequestException('This login is not unique')
    //   // }
    //   return error;
    // }
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const entity = await this.userService.findOne({ id });
    if (entity) {
      return entity;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!(await this.userService.findOne({ id }))) {
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
    const entity: User | null = await this.userService.findOne({ id });

    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userService.remove(entity);
  }
}
