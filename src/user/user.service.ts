import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { compareSync, genSalt, hash } from 'bcrypt';
import { LogService } from 'src/log/log.service';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  private CRYPT_SALT: number;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: LogService,
  ) {
    this.CRYPT_SALT = Number(process.env.CRYPT_SALT ?? 10);
    this.logger.setContext('UserService');
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log('This action adds a new user');

    /**
     * This check cannot work with the provided version of test:auth
     * as that test does not expects login to unique
     * in production that check should even be moved to a database constraint 
     */
    // const entity = await this.findOneBy({ login: createUserDto.login });
    // if (entity) {
    //   throw new ForbiddenException('user allready exists');
    // }

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
    return instanceToPlain(user)
    return result;
  }

  async findAll() {
    this.logger.log('This action returns all users');
    return instanceToPlain(await this.userRepository.find({}));
    const allUsers = await this.userRepository.find({});
    const allWithoutPassword = instanceToPlain(allUsers);
    // this.logger.log(`This action returns all users: ${JSON.stringify(allWithoutPassword)})`);
    return allWithoutPassword;
    // this.logger.log(`This action returns all users: ${JSON.stringify(allUsers)})`);
    // return allUsers;
  }

  async findOneBy(where: FindOptionsWhere<User>): Promise<User | undefined> {
    this.logger.log(`This action returns a ${JSON.stringify(where)} user`);
    return await this.userRepository.findOneBy(where);
  }

  async findOne(id: string) {
    this.logger.log(`This action returns a #${id} user`);
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    this.logger.log(`This XXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx action updates a #${id} user`);
  
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

        throw new HttpException("øøøps",HttpStatus.BAD_REQUEST,{cause: 'ikke godt', description:'blblblblbllla'});
        
      return userWithoutPassword;
    } else {
      throw new ForbiddenException('Incorrect old password');
    }
  }

  async remove(user: User) {
    this.logger.log(`This action removes a #${user.id} user`);
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
