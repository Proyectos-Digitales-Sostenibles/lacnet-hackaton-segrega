import { constructFactoryFn, ModelData, ModelType } from '@arsa-dev/nestjs-basics';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity, IBaseEntity, IBasicBaseEntity } from './base.entity';
import { BucketEntity } from './bucket.entity';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from './user.entity';

export type IBucketValidatorEntity = ModelType<BucketValidatorEntity>;

export type TBasicBucketValidatorEntity = IBasicBaseEntity & IBucketValidatorEntity;
export type TBucketValidatorEntity = IBaseEntity & IBucketValidatorEntity;

@Entity({ name: 'bucket_validators', schema: 'public' })
export class BucketValidatorEntity extends BaseEntity implements TBucketValidatorEntity {
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserEntity, (user) => user.validatingBuckets, { lazy: true, nullable: false })
  user: Promise<UserEntity>;

  @JoinColumn({ name: 'bucket_id' })
  @ManyToOne(() => BucketEntity, (bucket) => bucket.bucketValidators, { lazy: true, nullable: false })
  bucket: Promise<BucketEntity>;

  @Column({ name: 'limit_amount' })
  limitAmount: number;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.validationBucket, { lazy: true })
  validatedTransactions: Promise<TransactionEntity[]>;

  static readonly construct = constructFactoryFn<BucketValidatorEntity, ModelData<BucketValidatorEntity>>(BucketValidatorEntity);
}
