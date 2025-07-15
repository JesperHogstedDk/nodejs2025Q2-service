import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

interface JwtPayload {
  userId: number;
  username: string;
  // osv.
}

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;
  let jwtService: JwtService;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    jwtService = {
      verifyAsync: jest.fn(),
    } as any;

    guard = new AuthGuard(jwtService, reflector);
  });

  const createContext = (reqProps: Partial<Request>): ExecutionContext => {
    const mockRequest = {
      url: reqProps.url ?? '/protected',
      headers: reqProps.headers ?? {},
      ...reqProps,
    } as Request;

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getClass: () => null,
      getHandler: () => null,
    } as ExecutionContext;
  };

  it('should allow public routes', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
    const context = createContext({});
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow "/" route without checking token', async () => {
    const context = createContext({ url: '/' });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw if token is missing', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    const context = createContext({ headers: {} });

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('No token in header'),
    );
  });

  it('should throw if token is invalid', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('Invalid token'),
    );

    const context = createContext({
      headers: {
        authorization: 'Bearer invalid-token',
      },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Token not valid'),
    );
  });

  it('should attach user and allow access if token is valid', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    const payload = { userId: 42 };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

    const request: Partial<Request> = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = createContext(request);
    const result = await guard.canActivate(context);
    expect(result).toBe(true);

    const user = (context.switchToHttp().getRequest() as Request).user;
    expect(user).toEqual(payload);
  });
});
