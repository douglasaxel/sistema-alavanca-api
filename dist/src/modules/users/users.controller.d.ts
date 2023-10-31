import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<void>;
    findAll(): Promise<{
        id: number;
        name: string;
        email: string;
        image: string;
        role: import(".prisma/client").$Enums.UserRole;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        image: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        image: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    remove(id: number): Promise<{
        statusCode: HttpStatus;
    }>;
}
