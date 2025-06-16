import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';
import { compareSync, genSalt, hash } from 'bcrypt'

@Injectable()
export class UserService {
  private CRYPT_SALT: number;
  private CRYPT_PASSWORD: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.CRYPT_SALT = Number(process.env.CRYPT_SALT ?? 10);
    this.CRYPT_PASSWORD = process.env.CRYPT_PASSWORD ?? 'Crypt_Password';
  }

  async create(createUserDto: CreateUserDto) {
    console.log('This action adds a new user');
    const user = new User();
    user.id = randomUUID();
    user.login = createUserDto.login;
    user.password = await this.hashPassword(createUserDto.password);
    const date = new Date();
    user.createdAt = date.valueOf();
    user.updatedAt = date.valueOf();
    user.version = 1;
    await this.userRepository.save(user);
    const { id, login, version, createdAt, updatedAt } = user;
    const userWithoutPassword = { id, login, version, createdAt, updatedAt };
    return userWithoutPassword;
  }

  async findAll() {
    console.log('This action returns all users');
    const allUsers = await this.userRepository.find({
      select: ['id', 'login', 'version', 'createdAt', 'updatedAt'],
    });
    return allUsers;
  }

  async findOneByName(username: string): Promise<User | undefined> {
    console.log(`This action returns a ${username} user`);
    return await this.userRepository.findOneBy({ login: username });
  }

  async findOne(id: string) {
    console.log(`This action returns a #${id} user`);
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        console.log(`User with id ${id} not found`);
        return null;
      }
      const { login, version, createdAt, updatedAt } = user;
      const userWithoutPassword = { id, login, version, createdAt, updatedAt };
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error finding user with id ${id}:`, error);
      return null;
    }
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    console.log(`This action updates a #${id} user`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null
    }
    if (await this.verifyPassword(updatePasswordDto.oldPassword, user.password)) {
      console.log("Password verifyed: ", updatePasswordDto.oldPassword, user.password)
      user.password = await this.hashPassword(updatePasswordDto.newPassword);
      const date = new Date();
      user.updatedAt = date.valueOf();
      user.version += 1;
      const userUpdated = await this.userRepository.save(user);
      console.log("userUpdated", userUpdated)
      const { login, version, createdAt, updatedAt } = userUpdated;
      const userWithoutPassword = {
        id,
        login,
        version,
        createdAt,
        updatedAt,
      };
      return userWithoutPassword;
    } else {
      return null;
    }
  }

  async remove(id: string) {
    console.log(`This action removes a #${id} user`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return false;
    } else {
      try {
        const deleteResult = await this.userRepository.delete(id);
        console.log(`Delete result:`, deleteResult);
        if (deleteResult.affected === 0) {
          return false;
        } else if (deleteResult.affected > 0) {
          return true;
        }
      } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        return false;
      }
    }
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.CRYPT_SALT);
    const hashed = await hash(password, salt);
    return hashed;
  }

  public async verifyPassword(plainPW: string, hashedPW: string): Promise<boolean> {
    return compareSync(plainPW, hashedPW)
  }
}
