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
exports.CreateProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_collaborator_dto_1 = require("./create-collaborator.dto");
class CreateProjectDto {
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode ser vazio' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do cliente não pode ser vazio' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "idCustomer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A descrição não pode ser vazia' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O responsável não pode ser vazio' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "accountable", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O valor não pode ser vazio' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A URL do AirTable não pode ser vazio' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "airtableUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A URL do iframe do AirTable não pode ser vazio' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "airtableIframeUrl", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data de inicio não pode ser vazio' }),
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data de entrega não pode ser vazia' }),
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_collaborator_dto_1.CreateCollaboratorDto),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "collaborators", void 0);
//# sourceMappingURL=create-project.dto.js.map