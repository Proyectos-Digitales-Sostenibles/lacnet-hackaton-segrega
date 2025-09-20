import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from './database.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeORMConfig)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
