import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LogService } from 'src/log/log.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockJwtService: JwtService;
  let mockUserService: UserService;
  let mockLogger: LogService;

  beforeEach(() => {
    mockJwtService = {
      verify: jest.fn(),
      signAsync: jest.fn(),
    } as any;

    mockUserService = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      verifyPassword: jest.fn(),
    } as any;

    mockLogger = {
      log: jest.fn(),
      logException: jest.fn(),
      setContext: jest.fn(),
    } as any;

    service = new AuthService(mockLogger, mockJwtService, mockUserService);
  });

  describe('signUp', () => {
    it('should create user if login not taken', async () => {
      const dto: SignUpDto = { login: 'newUser', password: 'pass' };
      (mockUserService.findOneBy as jest.Mock).mockResolvedValue(null);
      (mockUserService.create as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await service.signUp(dto);
      expect(mockUserService.create).toHaveBeenCalledWith({
        login: 'newUser',
        password: 'pass',
      });
      expect(result).toEqual({ id: '1' });
    });

    it('should throw if user exists', async () => {
      (mockUserService.findOneBy as jest.Mock).mockResolvedValue({
        login: 'newUser',
      });
      await expect(
        service.signUp({ login: 'newUser', password: 'x' }),
      ).rejects.toThrow(new ForbiddenException('user allready exists'));
    });
  });

  describe('login', () => {
    it('should return token pair when credentials are correct', async () => {
      const dto: LogInDto = { login: 'Jesper', password: 'hunter2' };
      const user = { id: '7', login: 'Jesper', password: 'hash' };

      (mockUserService.findOneBy as jest.Mock).mockResolvedValue(user);
      (mockUserService.verifyPassword as jest.Mock).mockResolvedValue(true);
      (mockJwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        'access123',
      );
      (mockJwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        'refresh456',
      );

      const result = await service.login(dto);
      expect(result).toEqual({
        accessToken: 'access123',
        refreshToken: 'refresh456',
      });
    });

    it('should throw if user not found', async () => {
      (mockUserService.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login({ login: '404', password: 'xx' }),
      ).rejects.toThrow(new ForbiddenException('no user with such login'));
    });

    it('should throw if password is incorrect', async () => {
      (mockUserService.findOneBy as jest.Mock).mockResolvedValue({
        password: 'hashed',
      });
      (mockUserService.verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ login: 'bad', password: 'wrong' }),
      ).rejects.toThrow(
        new UnauthorizedException("login or password doesn't match"),
      );
    });
  });

  describe('refresh', () => {
    const payload: JwtPayloadDto = { userId: '1', login: 'Jesper' };

    it('should return new token pair if refreshToken is valid', async () => {
      (mockJwtService.verify as jest.Mock).mockReturnValue(payload);
      (mockJwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        'newAccess',
      );
      (mockJwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        'newRefresh',
      );

      const result = await service.refresh('valid.refresh.token');
      expect(result).toEqual({
        accessToken: 'newAccess',
        refreshToken: 'newRefresh',
      });
    });

    it('should throw ForbiddenException on JsonWebTokenError', async () => {
      const error = { name: 'JsonWebTokenError', message: 'bad token' };
      (mockJwtService.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(service.refresh('invalid')).rejects.toThrow(
        new ForbiddenException(error),
      );
    });

    it('should throw ForbiddenException on TokenExpiredError', async () => {
      const error = { name: 'TokenExpiredError', message: 'expired token' };
      (mockJwtService.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(service.refresh('expired')).rejects.toThrow(
        new ForbiddenException(error),
      );
    });
  });
});
