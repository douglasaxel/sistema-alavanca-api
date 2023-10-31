import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn({ email, password }: LoginDto): Promise<{
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
