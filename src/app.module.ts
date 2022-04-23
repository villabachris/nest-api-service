import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
  imports: [ReportsModule, MongooseModule.forRoot(config.MongoURI)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
