import { User } from '../entities/user.entity';
import { UserRoles } from '../../roles/roles.enum';
declare const CreateUserDto_base: import("@nestjs/common").Type<Omit<User, "id">>;
export declare class CreateUserDto extends CreateUserDto_base {
    name: string;
    email: string;
    password: string;
    image: string;
    role: UserRoles;
}
export {};
