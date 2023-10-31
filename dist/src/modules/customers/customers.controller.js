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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const auth_guard_1 = require("../auth/auth.guard");
const roles_decorator_1 = require("../roles/roles.decorator");
const roles_enum_1 = require("../roles/roles.enum");
const swagger_1 = require("@nestjs/swagger");
const airtable_helpers_1 = require("../../utils/airtable-helpers");
const string_helper_1 = require("../../utils/string-helper");
const googleapi_1 = require("../../services/googleapi");
let CustomersController = exports.CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async create(createCustomerDto) {
        const exist = await this.customersService.findOneByUniqueKeys({
            cnpj: createCustomerDto.cnpj,
            email: createCustomerDto.email,
            phone: createCustomerDto.phone,
        });
        if (createCustomerDto.email.includes(exist?.email)) {
            throw new common_1.BadRequestException(['E-mail já está em uso']);
        }
        if (createCustomerDto.cnpj.includes(exist?.cnpj)) {
            throw new common_1.BadRequestException(['CNPJ já cadastrado']);
        }
        if (createCustomerDto.phone.includes(exist?.phone)) {
            throw new common_1.BadRequestException(['Telefone já cadastrado']);
        }
        const { base64, mimeType } = (0, string_helper_1.getBase64MimeTypeAndValue)(createCustomerDto.image);
        const thumbnailLink = await (0, googleapi_1.createDriveFile)({
            fileBase64: base64,
            name: createCustomerDto.name,
            type: 'customer',
            mimeType,
        });
        const customer = await this.customersService.create({
            ...createCustomerDto,
            image: thumbnailLink,
        });
        if (!customer) {
            throw new common_1.InternalServerErrorException();
        }
        return {
            ...customer,
            updatedAt: undefined,
            deletedAt: undefined,
        };
    }
    async findAll() {
        const customers = await this.customersService.findAll();
        return customers.map(customer => ({
            ...customer,
            updatedAt: undefined,
            deletedAt: undefined,
        }));
    }
    async findOne(id) {
        const customer = await this.customersService.findOne(id);
        if (!customer) {
            throw new common_1.NotFoundException(['Este cliente não existe']);
        }
        const results = [];
        for (const proj of customer.projects) {
            const tasks = await (0, airtable_helpers_1.getProjectTasks)(proj.airtableUrl);
            results.push({ ...proj, tasks });
        }
        return {
            ...customer,
            projects: results,
            updatedAt: undefined,
            deletedAt: undefined,
        };
    }
    async update(id, updateCustomerDto) {
        const customer = await this.customersService.findOne(id);
        if (!customer) {
            throw new common_1.NotFoundException(['Este cliente não existe']);
        }
        const updatedCustomer = await this.customersService.update(id, updateCustomerDto);
        return {
            ...updatedCustomer,
            updatedAt: undefined,
            deletedAt: undefined,
        };
    }
    async remove(id) {
        const customer = await this.customersService.findOne(id);
        if (!customer) {
            throw new common_1.NotFoundException(['Este cliente não existe']);
        }
        await this.customersService.remove(id);
        return {
            statusCode: common_1.HttpStatus.NO_CONTENT,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, auth_guard_1.UseAuthGuard)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRoles.ADMIN, roles_enum_1.UserRoles.MASTER),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map