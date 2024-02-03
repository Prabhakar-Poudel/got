import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { EventGateway } from './event.gateway';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CacheModule.register()],
  controllers: [AppController],
  providers: [AppService, EventGateway],
})
export class AppModule {}
