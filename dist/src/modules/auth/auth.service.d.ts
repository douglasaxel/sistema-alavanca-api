import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signIn(email: string, password: string): Promise<{
        token: string;
        user: {
            id: number;
            role: import(".prisma/client").$Enums.UserRole;
            name: string;
            email: string;
            image: string;
        };
    }>;
}
