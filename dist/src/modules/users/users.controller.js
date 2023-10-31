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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const roles_enum_1 = require("../roles/roles.enum");
const auth_guard_1 = require("../auth/auth.guard");
const password_1 = require("../../utils/password");
const roles_decorator_1 = require("../roles/roles.decorator");
const googleapi_1 = require("../../services/googleapi");
const string_helper_1 = require("../../utils/string-helper");
let UsersController = exports.UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto) {
        const exist = await this.usersService.findOneByEmail(createUserDto.email);
        if (exist) {
            throw new common_1.BadRequestException(['E-mail já está em uso']);
        }
        const { base64, mimeType } = (0, string_helper_1.getBase64MimeTypeAndValue)(createUserDto.image);
        const thumbnailLink = await (0, googleapi_1.createDriveFile)({
            fileBase64: base64,
            name: createUserDto.name,
            type: 'user',
            mimeType,
        });
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: await (0, password_1.hashPasssword)(createUserDto.password),
            image: thumbnailLink,
        });
        return newUser;
    }
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
        }));
    }
    async findOne(id) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException(['Este usuário não existe']);
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
        };
    }
    async update(id, updateUserDto) {
        const exist = await this.usersService.findOne(id);
        if (!exist) {
            throw new common_1.NotFoundException(['Este usuário não existe']);
        }
        const user = await this.usersService.update(id, updateUserDto);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
        };
    }
    async remove(id) {
        const exist = await this.usersService.findOne(id);
        if (!exist) {
            throw new common_1.NotFoundException(['Este usuário não existe']);
        }
        await this.usersService.remove(id);
        return {
            statusCode: common_1.HttpStatus.NO_CONTENT,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, auth_guard_1.UseAuthGuard)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRoles.ADMIN),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map