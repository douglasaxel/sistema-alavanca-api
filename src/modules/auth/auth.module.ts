import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from 'src/modules/users/users.service';

@Module({
	imports: [UsersModule],
	controllers: [AuthController],
	providers: [AuthService, UsersService],
})
export class AuthModule {}
