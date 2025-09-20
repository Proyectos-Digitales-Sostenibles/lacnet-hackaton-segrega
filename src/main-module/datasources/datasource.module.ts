import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

const DATASOURCES = [DatabaseModule];

@Module({
  imports: [...DATASOURCES],
  exports: [...DATASOURCES],
})
export class DatasourceModule {}
