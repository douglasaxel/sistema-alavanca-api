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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const password_1 = require("../../utils/password");
let AuthService = exports.AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signIn(email, password) {
        const result = await this.usersService.findOneByEmail(email);
        if (!result) {
            throw new common_1.NotFoundException(['Usuário não encontrado']);
        }
        const { password: userPassword, ...user } = result;
        const isMatch = await (0, password_1.comparePassword)(password, userPassword);
        if (!isMatch) {
            throw new common_1.UnauthorizedException(['Credenciais inválidas']);
        }
        const token = this.jwtService.sign({
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, {
            expiresIn: '1 day',
            secret: process.env.JWT_SECRET,
        });
        return {
            token,
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email,
                image: user.image,
            },
        };
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map