import { HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<{
        updatedAt: any;
        deletedAt: any;
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        updatedAt: any;
        deletedAt: any;
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
    }[]>;
    findOne(id: number): Promise<{
        projects: any[];
        updatedAt: any;
        deletedAt: any;
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
    }>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<{
        updatedAt: any;
        deletedAt: any;
        id: number;
        image: string;
        name: string;
        phone: string;
        email: string;
        cnpj: string;
        accountable: string;
        createdAt: Date;
    }>;
    remove(id: number): Promise<{
        statusCode: HttpStatus;
    }>;
}
