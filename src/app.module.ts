import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main-module/main.module';
import { ServicesModule } from './main-module/services/services.module';
@Module({
  imports: [ScheduleModule.forRoot(), MainModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService, ServicesModule],
})
export class AppModule {}
