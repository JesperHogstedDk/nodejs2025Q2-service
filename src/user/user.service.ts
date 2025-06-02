import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { users } from '../db';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    console.log('This action adds a new user');
    const user = new User();
    user.id = randomUUID();
    user.login = createUserDto.login;
    user.password = createUserDto.password;
    const date = new Date();
    user.createdAt = date.valueOf();
    user.updatedAt = date.valueOf();
    user.version = 1;
    users.set(user.id, user);
    const { id, login, version, createdAt, updatedAt } = user;
    const userWithoutPassword = { id, login, version, createdAt, updatedAt };
    return userWithoutPassword;
  }

  findAll() {
    console.log('This action returns all users');
    const allUsers = Array.from(users.values()).map((user) => {
      const { id, login, version, createdAt, updatedAt } = user;
      return { id, login, version, createdAt, updatedAt };
    });
    return allUsers;
  }

  findOne(id: string) {
    console.log(`This action returns a #${id} user`);
    if (users.has(id)) {
      const user = users.get(id);
      const { login, version, createdAt, updatedAt } = user;
      const userWithoutPassword = { id, login, version, createdAt, updatedAt };
      return userWithoutPassword;
    }
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    console.log(`This action updates a #${id} user`);
    if (users.has(id)) {
      const user = users.get(id);
      if (user && user.password === updatePasswordDto.oldPassword) {
        user.password = updatePasswordDto.newPassword;
        const date = new Date();
        user.updatedAt = date.valueOf();
        user.version += 1;
        users.set(id, user);
        const { login, version, createdAt, updatedAt } = user;
        const userWithoutPassword = {
          id,
          login,
          version,
          createdAt,
          updatedAt,
        };
        return userWithoutPassword;
      } else {
        console.log(
          `User with id ${id} not found or old password does not match`,
        );
        return null;
      }
    }
  }

  remove(id: string) {
    console.log(`This action removes a #${id} user`);
    if (users.has(id)) {
      return users.delete(id);
    }
  }
}
