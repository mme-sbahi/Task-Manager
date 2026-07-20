export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    avatarUrl?: string;
    hashedRefreshToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
