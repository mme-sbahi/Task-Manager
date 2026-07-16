import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const baseUser: User = {
    id: 'user-1',
    email: 'meryeme@example.com',
    passwordHash: '',
    fullName: 'Meryeme El Amrani',
    avatarUrl: undefined,
    hashedRefreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findByIdWithRefreshToken: jest.fn(),
            setRefreshTokenHash: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed.jwt.token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values: Record<string, string> = {
                JWT_ACCESS_SECRET: 'access-secret',
                JWT_ACCESS_EXPIRATION: '15m',
                JWT_REFRESH_SECRET: 'refresh-secret',
                JWT_REFRESH_EXPIRATION: '7d',
              };
              return values[key];
            }),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('hashes the password, creates the user, and returns tokens without the password hash', async () => {
      const createdUser: User = { ...baseUser, passwordHash: 'hashed-pw' };
      usersService.create.mockResolvedValue(createdUser);

      const result = await authService.register({
        email: baseUser.email,
        password: 'StrongPassword123!',
        fullName: baseUser.fullName,
      });

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: baseUser.email }),
      );
      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(
        baseUser.id,
        expect.any(String),
      );
      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.refreshToken).toBe('signed.jwt.token');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('hashedRefreshToken');
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when the email is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'nobody@example.com', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      usersService.findByEmail.mockResolvedValue({ ...baseUser, passwordHash });

      await expect(
        authService.login({ email: baseUser.email, password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens when credentials are valid', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      usersService.findByEmail.mockResolvedValue({ ...baseUser, passwordHash });

      const result = await authService.login({
        email: baseUser.email,
        password: 'correct-password',
      });

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2); // access + refresh
    });
  });

  describe('refreshTokens', () => {
    it('throws ForbiddenException if the user has no stored refresh token', async () => {
      usersService.findByIdWithRefreshToken.mockResolvedValue({
        ...baseUser,
        hashedRefreshToken: null,
      });

      await expect(
        authService.refreshTokens(baseUser.id, 'some-refresh-token'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException if the provided refresh token does not match the stored hash', async () => {
      const storedHash = await bcrypt.hash('the-real-refresh-token', 4);
      usersService.findByIdWithRefreshToken.mockResolvedValue({
        ...baseUser,
        hashedRefreshToken: storedHash,
      });

      await expect(
        authService.refreshTokens(baseUser.id, 'a-forged-refresh-token'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('rotates and returns a new token pair when the refresh token matches', async () => {
      const storedHash = await bcrypt.hash('the-real-refresh-token', 4);
      usersService.findByIdWithRefreshToken.mockResolvedValue({
        ...baseUser,
        hashedRefreshToken: storedHash,
      });

      const result = await authService.refreshTokens(
        baseUser.id,
        'the-real-refresh-token',
      );

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(
        baseUser.id,
        expect.any(String),
      );
    });
  });

  describe('logout', () => {
    it('clears the stored refresh token hash', async () => {
      await authService.logout(baseUser.id);
      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(
        baseUser.id,
        null,
      );
    });
  });
});
