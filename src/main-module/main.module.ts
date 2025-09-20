import { Module } from '@nestjs/common';
import { DatasourceModule } from './datasources/datasource.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [DatasourceModule, ServicesModule],
})
export class MainModule {}
