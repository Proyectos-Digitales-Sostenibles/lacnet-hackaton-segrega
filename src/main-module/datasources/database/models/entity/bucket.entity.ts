import { constructFactoryFn, ModelData, ModelType } from '@arsa-dev/nestjs-basics';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, IBaseEntity, IBasicBaseEntity } from './base.entity';
import { BucketValidatorEntity } from './bucket-validator.entity';

export type IBucketEntity = ModelType<BucketEntity>;

export type TBasicBucketEntity = IBasicBaseEntity & IBucketEntity;
export type TBucketEntity = IBaseEntity & IBucketEntity;

@Entity({ name: 'buckets', schema: 'public' })
export class BucketEntity extends BaseEntity implements TBucketEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @OneToMany(() => BucketValidatorEntity, (bucketValidator) => bucketValidator.bucket, { lazy: true })
  bucketValidators: Promise<BucketValidatorEntity[]>;

  static readonly construct = constructFactoryFn<BucketEntity, ModelData<BucketEntity>>(BucketEntity);
}
