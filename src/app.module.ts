import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { ContractService } from './contract/contract.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AppGateway, ContractService],
})
export class AppModule {}
