import { constructFactoryFn, ModelData, ModelType } from '@arsa-dev/nestjs-basics';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, IBaseEntity, IBasicBaseEntity } from './base.entity';
import { BucketValidatorEntity } from './bucket-validator.entity';
import { UserEntity } from './user.entity';

export type ITransactionEntity = ModelType<TransactionEntity>;

export type TBasicTransactionEntity = IBasicBaseEntity & ITransactionEntity;
export type TTransactionEntity = IBaseEntity & ITransactionEntity;

@Entity({ name: 'transactions', schema: 'public' })
export class TransactionEntity extends BaseEntity implements TTransactionEntity {
  @JoinColumn({ name: 'source_user_id' })
  @ManyToOne(() => UserEntity, (user) => user.sentTransactions, { lazy: true, nullable: true })
  sourceUser: Promise<UserEntity>;

  @JoinColumn({ name: 'target_user_id' })
  @ManyToOne(() => UserEntity, (user) => user.receivedTransactions, { lazy: true, nullable: false })
  targetUser: Promise<UserEntity>;

  @Column({ name: 'amount', type: 'decimal', precision: 15, scale: 6 })
  amount: number;

  @Column({ name: 'concept', default: '' })
  concept: string;

  @Column({ name: 'date', type: 'timestamp', precision: 3, default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Index()
  @Column({ name: 'confirm_date', type: 'timestamp', precision: 3, nullable: true })
  confirmDate: Date | null;

  @JoinColumn({ name: 'validation_bucket_id' })
  @ManyToOne(() => BucketValidatorEntity, (validationBucket) => validationBucket.validatedTransactions, { lazy: true, nullable: true })
  validationBucket: Promise<BucketValidatorEntity | null>;

  @Column({ name: 'inmutable_hash', nullable: true, default: null })
  inmutableHash: string | null;

  static readonly construct = constructFactoryFn<TransactionEntity, ModelData<TransactionEntity>>(TransactionEntity);
}
