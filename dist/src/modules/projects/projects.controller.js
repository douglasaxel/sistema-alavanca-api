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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const find_all_projects_dto_1 = require("./dto/find-all-projects.dto");
const airtable_helpers_1 = require("../../utils/airtable-helpers");
const exclude_key_from_obj_1 = require("../../utils/exclude-key-from-obj");
const googleapi_1 = require("../../services/googleapi");
const create_calendar_event_dto_1 = require("./dto/create-calendar-event.dto");
const swagger_1 = require("@nestjs/swagger");
const create_collaborator_dto_1 = require("./dto/create-collaborator.dto");
let ProjectsController = exports.ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async create(createProjectDto) {
        const driverFolderId = await (0, googleapi_1.createDriveFolder)(createProjectDto.name);
        await (0, googleapi_1.copyFilesToNewFolder)('1cURb4T_Tlnz8RVDaOut9IYsBzVmlwa3z', driverFolderId);
        return this.projectsService.create(createProjectDto, driverFolderId);
    }
    async createEvent(id, { startDate, endDate }) {
        const project = await this.projectsService.findOne(id);
        if (!project)
            throw new common_1.NotFoundException(['Este projeto não existe']);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException([
                'A data final não pode ser anterior a data inicial',
            ]);
        }
        const { name, collaborators } = project;
        await (0, googleapi_1.createGoogleCalendarEvent)(name, startDate, endDate, collaborators.map(c => c.email));
        return null;
    }
    async findAll(findAllProjectDto) {
        const projects = await this.projectsService.findAll(findAllProjectDto);
        const results = [];
        for (const proj of projects) {
            const tasks = await (0, airtable_helpers_1.getProjectTasks)(proj.airtableUrl);
            results.push({ ...proj, tasks });
        }
        return results;
    }
    async findOne(id) {
        const project = await this.projectsService.findOne(+id);
        if (!project) {
            throw new common_1.NotFoundException(['Este projeto não existe']);
        }
        (0, exclude_key_from_obj_1.excludeKeyFromObj)(project, ['deletedAt']);
        const tasks = await (0, airtable_helpers_1.getProjectTasks)(project.airtableUrl);
        const googleFiles = await (0, googleapi_1.listDriveFiles)(project.driveFolderId);
        const googleCalendar = await (0, googleapi_1.listCalendarEvents)(project.name);
        return {
            ...project,
            tasks,
            googleFiles,
            googleCalendar,
        };
    }
    update(id, updateProjectDto) {
        return this.projectsService.update(+id, updateProjectDto);
    }
    async addCollaborators(id, createCollaboratorDto) {
        return this.projectsService.createCollaborators(id, createCollaboratorDto);
    }
    async removeCollaborators(id, idCollaborator) {
        await this.projectsService.removeCollaborators(id, idCollaborator);
        return null;
    }
    remove(id) {
        return this.projectsService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Post)(':id/event'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_calendar_event_dto_1.CreateCalendarEventDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_projects_dto_1.FindAllProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/collaborators'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_collaborator_dto_1.CreateCollaboratorDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "addCollaborators", null);
__decorate([
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Delete)(':id/collaborators/:idCollaborator'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('idCollaborator')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "removeCollaborators", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map