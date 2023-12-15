import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomersModule } from './modules/customers/customers.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';

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
		CustomersModule,
		ProjectsModule,
		MessagesModule,
		CacheModule.register({
			isGlobal: true,
			ttl: 1 * 60 * 60 * 1000,
		}),
		CollaboratorsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
