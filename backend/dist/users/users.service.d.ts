import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByIdWithRefreshToken(id: string): Promise<User | null>;
    create(dto: CreateUserDto & {
        passwordHash: string;
    }): Promise<User>;
    setRefreshTokenHash(userId: string, hashedRefreshToken: string | null): Promise<void>;
}
