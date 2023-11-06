import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { comparePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async signIn(email: string, password: string) {
		const result = await this.usersService.findOneByEmail(email);

		if (!result) {
			throw new NotFoundException(['Usuário não encontrado']);
		}

		const { password: userPassword, ...user } = result;

		const isMatch = await comparePassword(password, userPassword);
		if (!isMatch) {
			throw new UnauthorizedException(['Credenciais inválidas']);
		}

		const token = this.jwtService.sign(
			{
				sub: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			{
				expiresIn: '1 day',
				secret: process.env.JWT_SECRET,
			},
		);

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
}
