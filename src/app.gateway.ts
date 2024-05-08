/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { CronJob } from 'cron';
import { ContractService } from './contract/contract.service';

@WebSocketGateway()
export class AppGateway {
  private readonly logger = new Logger(AppGateway.name);

  constructor(private schedulerRegistry: SchedulerRegistry, private readonly contractService: ContractService) {
    this.logger.verbose("initiated")
    this.setupCronJob(1715213179)
  }

  setupCronJob(unixTimestamp: number) {
    const now = new Date();
    let startDate = new Date(unixTimestamp * 1000); // Convert Unix timestamp to Date

    // If the scheduled start time is in the past, calculate the next valid start time that is exactly one week from the past time
    while (startDate < now) {
      startDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Add one week
    }

    this.scheduleNextExecution(startDate);
  }

  private scheduleNextExecution(date: Date) {
    const job = new CronJob(date, () => {
      this.executeTask();

      // Schedule the next execution one week from the current execution time
      const nextExecutionTime = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      this.scheduleNextExecution(nextExecutionTime);
    }, null, true, 'UTC');

    const jobName = `job-${date.getTime()}`;
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
    this.logger.log(`Scheduled task ${jobName} at ${date}`);
  }

  private executeTask() {
    this.logger.log('Executing task');
    this.contractService.updateContractPeriod()
    // Task logic here
  }
}
