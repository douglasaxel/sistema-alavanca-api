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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let UsersService = exports.UsersService = class UsersService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createUserDto) {
        const exist = await this.findOneByEmail(createUserDto.email);
        if (exist) {
            throw new common_1.BadRequestException(['E-mail already in use']);
        }
        await this.prismaService.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password: createUserDto.password,
                image: createUserDto.image,
                role: createUserDto.role,
            },
        });
    }
    async findAll() {
        const users = await this.prismaService.user.findMany({
            where: { deletedAt: null },
        });
        return users;
    }
    async findOne(id) {
        const user = await this.prismaService.user.findUnique({
            where: { id, deletedAt: null },
        });
        return user;
    }
    async findOneByEmail(email) {
        const user = await this.prismaService.user.findFirst({
            where: { email, deletedAt: null },
        });
        return user;
    }
    async update(id, updateUserDto) {
        const updatedUser = await this.prismaService.user.update({
            where: { id, deletedAt: null },
            data: {
                name: updateUserDto.name,
                email: updateUserDto.email,
                password: updateUserDto.password,
                image: updateUserDto.image,
                role: updateUserDto.role,
            },
        });
        return updatedUser;
    }
    async remove(id) {
        await this.prismaService.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map