import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { compareSync, genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  private CRYPT_SALT: number;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.CRYPT_SALT = Number(process.env.CRYPT_SALT ?? 10);
  }

  async create(createUserDto: CreateUserDto) {
    console.log('This action adds a new user');
    const hashedPasword = await this.hashPassword(createUserDto.password);
    const date = Date.now();
    const user = new User({
      login: createUserDto.login,
      password: hashedPasword,
      createdAt: date,
      updatedAt: date,
    });
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    console.log('This action returns all users');
    const allUsers = await this.userRepository.find({});
    return allUsers;
  }

  async findOneByName(username: string): Promise<User | undefined> {
    console.log(`This action returns a ${username} user`);
    return await this.userRepository.findOne({ where: { login: username } });
  }

  async findOne(where: FindOptionsWhere<User>) {
    console.log(`This action returns a #${where.id} user`);
    return await this.userRepository.findOneBy(where);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    console.log(`This action updates a #${id} user`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    if (
      await this.verifyPassword(updatePasswordDto.oldPassword, user.password)
    ) {
      user.password = await this.hashPassword(updatePasswordDto.newPassword);
      user.updatedAt = Date.now();
      user.version += 1;
      const { password, ...userWithoutPassword } =
        await this.userRepository.save(user);
      return userWithoutPassword;
    } else {
      throw new ForbiddenException('Incorrect old password');
    }
  }

  async remove(user: User) {
    console.log(`This action removes a #${user.id} user`);
    return await this.userRepository.remove(user);
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.CRYPT_SALT);
    const hashed = await hash(password, salt);
    return hashed;
  }

  public async verifyPassword(
    plainPW: string,
    hashedPW: string,
  ): Promise<boolean> {
    return compareSync(plainPW, hashedPW);
  }
}
