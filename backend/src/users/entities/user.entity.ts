import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  // Never serialized in API responses
  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  // Stores a bcrypt hash of the current valid refresh token (rotated on
  // every refresh / cleared on logout). Excluded from responses and from
  // default SELECTs so it's never accidentally leaked.
  @Exclude()
  @Column({
    type: 'varchar',
    name: 'hashed_refresh_token',
    nullable: true,
    select: false,
  })
  hashedRefreshToken?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
