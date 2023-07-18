import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		AuthModule,
		UsersModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
