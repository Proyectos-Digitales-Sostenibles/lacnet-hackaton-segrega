import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ConfigProvider } from 'src/config.provider';
import { DataSource, DataSourceOptions } from 'typeorm';
import { BucketValidatorEntity } from './models/entity/bucket-validator.entity';
import { BucketEntity } from './models/entity/bucket.entity';
import { EnvConfigEntity } from './models/entity/envconfig.entity';
import { TransactionEntity } from './models/entity/transaction.entity';
import { UserEntity } from './models/entity/user.entity';

const cpi = ConfigProvider.instance();

export const ENTITIES: EntityClassOrSchema[] = [EnvConfigEntity, UserEntity, TransactionEntity, BucketValidatorEntity, BucketEntity];

const envSslConfig = cpi.getConfig('DB__SSL_ENABLE')!;
// Leave undefined if env==false, if set true allow any cert, otherwise parse setted value as JSON
const sslConfig =
  envSslConfig.toLowerCase() === 'false' ? undefined : envSslConfig.toLowerCase() === 'true' ? { rejectUnauthorized: false } : JSON.parse(envSslConfig!);

export const TypeORMConfig: DataSourceOptions = {
  type: 'postgres',
  username: cpi.getConfig('DB__USER')!,
  password: cpi.getConfig('DB__PASSWORD')!,
  database: cpi.getConfig('DB__DATABASE')!,
  host: cpi.getConfig('DB__HOST')!,
  port: parseInt(cpi.getConfig('DB__PORT')!),
  ssl: sslConfig,
  entities: [...ENTITIES],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: cpi.getConfig('DB__RUN_MIGRATIONS') === 'true',
  synchronize: false,
};

let conn;
if (process.env['TYPEORM_RAW_CONNECTION'] === '1') {
  conn = new DataSource(TypeORMConfig);
}
export const DatabaseConnection = conn;
