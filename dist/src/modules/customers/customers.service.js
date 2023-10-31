"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CustomersService = exports.CustomersService = class CustomersService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create({ image, name, cnpj, accountable, email, phone, }) {
        const customer = await this.prismaService.customer.create({
            data: {
                image,
                name,
                cnpj,
                accountable,
                email,
                phone,
            },
        });
        return customer;
    }
    async findAll() {
        const customers = await this.prismaService.customer.findMany({
            where: { deletedAt: null },
            include: {
                _count: true,
            },
        });
        return customers.map(customer => ({
            ...customer,
            _count: undefined,
            totalProjects: customer._count.projects,
        }));
    }
    async findOne(id) {
        const customer = await this.prismaService.customer.findUnique({
            where: { id, deletedAt: null },
            include: {
                projects: true,
            },
        });
        return customer;
    }
    async findOneByUniqueKeys({ cnpj, email, phone, }) {
        const customer = await this.prismaService.customer.findFirst({
            where: {
                deletedAt: null,
                OR: [{ cnpj }, { email }, { phone }],
            },
        });
        if (!customer)
            return null;
        return customer;
    }
    async update(id, { image, name, cnpj, accountable, email, phone }) {
        const customer = await this.prismaService.customer.update({
            where: { id, deletedAt: null },
            data: {
                image,
                name,
                cnpj,
                accountable,
                email,
                phone,
            },
        });
        return customer;
    }
    async remove(id) {
        await this.prismaService.customer.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map