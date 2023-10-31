import { UserRoles } from '../../roles/roles.enum';
export declare class User {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly role: UserRoles;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
