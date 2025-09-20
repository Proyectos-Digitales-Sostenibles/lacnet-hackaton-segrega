import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '../datasources/database/database.config';
import { TransactionHashSchedulerService } from './transaction-hash.scheduler';

const SERVICES = [TransactionHashSchedulerService];

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  providers: SERVICES,
  exports: SERVICES,
})
export class ServicesModule {}
