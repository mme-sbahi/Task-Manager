import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Fetches the user together with the (normally hidden) refresh token hash.
  // Used only by AuthService when validating a refresh token.
  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.hashedRefreshToken')
      .where('user.id = :id', { id })
      .getOne();
  }

  async create(dto: CreateUserDto & { passwordHash: string }): Promise<User> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash: dto.passwordHash,
      fullName: dto.fullName,
      avatarUrl: dto.avatarUrl,
    });

    return this.usersRepository.save(user);
  }

  async setRefreshTokenHash(
    userId: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.usersRepository.update(userId, { hashedRefreshToken });
  }
}
