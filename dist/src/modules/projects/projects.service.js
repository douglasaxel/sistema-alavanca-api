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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ProjectsService = exports.ProjectsService = class ProjectsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    create({ collaborators, ...createData }, driveFolderId) {
        return this.prismaService.project.create({
            data: {
                ...createData,
                driveFolderId,
                collaborators: !collaborators
                    ? undefined
                    : {
                        create: collaborators,
                    },
            },
        });
    }
    findAll({ name, startDate, endDate, customerId, collaborators, }) {
        return this.prismaService.project.findMany({
            where: {
                name: !name ? undefined : { contains: name },
                startDate: !startDate ? undefined : { gte: startDate },
                endDate: !endDate ? undefined : { lte: endDate },
                customer: !customerId ? undefined : { id: customerId },
                deletedAt: null,
            },
            include: {
                customer: true,
                collaborators,
            },
        });
    }
    findOne(id) {
        return this.prismaService.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                collaborators: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    update(id, updateData) {
        return this.prismaService.project.update({
            where: { id, deletedAt: null },
            data: {
                ...updateData,
                collaborators: undefined,
            },
        });
    }
    async createCollaborators(id, collaborator) {
        return this.prismaService.collaborator.create({
            data: {
                ...collaborator,
                idProject: id,
            }
        });
    }
    async removeCollaborators(idProject, idCollaborator) {
        return this.prismaService.collaborator.delete({
            where: { id: idCollaborator, idProject }
        });
    }
    remove(id) {
        return this.prismaService.project.update({
            where: { id, deletedAt: null },
            data: { deletedAt: new Date() },
        });
    }
};
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map