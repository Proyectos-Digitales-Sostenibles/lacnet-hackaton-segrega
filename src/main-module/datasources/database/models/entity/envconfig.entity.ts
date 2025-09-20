import { constructFactoryFn, ModelData, ModelType } from '@arsa-dev/nestjs-basics';
import { Column, Entity } from 'typeorm';
import { BaseEntity, IBaseEntity, IBasicBaseEntity } from './base.entity';

export type IEnvConfigEntity = ModelType<EnvConfigEntity>;

export type TBasicEnvConfigEntity = IBasicBaseEntity & IEnvConfigEntity;
export type TEnvConfigEntity = IBaseEntity & IEnvConfigEntity;

@Entity({ name: 'envconfig', schema: 'public' })
export class EnvConfigEntity extends BaseEntity implements TEnvConfigEntity {
  @Column({ name: 'code', unique: true })
  code: string;
  @Column({ name: 'type' })
  type: string;
  @Column({ name: 'data' })
  data: string;
  @Column({ name: 'internal' })
  internal: boolean;

  static readonly construct = constructFactoryFn<EnvConfigEntity, ModelData<EnvConfigEntity>>(EnvConfigEntity);
}
