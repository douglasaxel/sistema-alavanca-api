import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRoles } from '../roles/roles.enum';
import { ROLES_KEY } from '../roles/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException(['O token de autorização é obrigatório']);
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SECRET,
			});
			const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
				ROLES_KEY,
				[context.getHandler(), context.getClass()],
			);

			if (!requiredRoles) {
				return true;
			}

			request['user'] = payload;
			return requiredRoles.some(role => payload.role?.includes(role));
		} catch {
			throw new UnauthorizedException(['Você não possui permissão']);
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}

export const UseAuthGuard = () => UseGuards(AuthGuard);
