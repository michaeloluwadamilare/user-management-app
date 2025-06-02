import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule, AuthModule,  
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }), DatabaseModule, EmployeeModule, 
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 3
    }, 
    {
      name: 'long',
      ttl: 60000,
      limit: 100
    }])
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD,useClass: ThrottlerGuard}],
})
export class AppModule {}
