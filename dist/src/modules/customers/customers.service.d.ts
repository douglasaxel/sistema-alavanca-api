import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/database/prisma.service';
type IFindOneByUniqueKeysParams = {
    cnpj?: string;
    email?: string;
    phone?: string;
};
export declare class CustomersService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create({ image, name, cnpj, accountable, email, phone, }: CreateCustomerDto): Promise<{
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }>;
    findAll(): Promise<{
        _count: any;
        totalProjects: number;
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        projects: {
            id: number;
            idCustomer: number;
            name: string;
            description: string;
            accountable: string;
            value: number;
            airtableUrl: string;
            airtableIframeUrl: string;
            driveFolderId: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            startDate: Date;
            endDate: Date;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
        }[];
    } & {
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }>;
    findOneByUniqueKeys({ cnpj, email, phone, }: IFindOneByUniqueKeysParams): Promise<{
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }>;
    update(id: number, { image, name, cnpj, accountable, email, phone }: UpdateCustomerDto): Promise<{
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }>;
    remove(id: number): Promise<void>;
}
export {};
