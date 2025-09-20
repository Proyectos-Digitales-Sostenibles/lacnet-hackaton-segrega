import { constructFactoryFn, ModelData, ModelType } from '@arsa-dev/nestjs-basics';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, IBaseEntity, IBasicBaseEntity } from './base.entity';
import { BucketValidatorEntity } from './bucket-validator.entity';
import { TransactionEntity } from './transaction.entity';

export const RoleTypeOptions = ['USER', 'ADMIN', 'VALIDATOR', 'COLLABORATOR', 'PROJECT'] as const;
export type RoleType = (typeof RoleTypeOptions)[number];

export type IUserEntity = ModelType<UserEntity>;

export type TBasicUserEntity = IBasicBaseEntity & IUserEntity;
export type TUserEntity = IBaseEntity & IUserEntity;

@Entity({ name: 'users', schema: 'public' })
export class UserEntity extends BaseEntity implements TUserEntity {
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'email', unique: true })
  email: string;
  @Column({ name: 'password' })
  password: string;
  @Column({ name: 'reset_password_hash', nullable: true })
  resetPasswordHash: string;
  @Column({ name: 'role', enum: RoleTypeOptions })
  role: RoleType;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.sourceUser, { lazy: true })
  sentTransactions: Promise<TransactionEntity[]>;
  @OneToMany(() => TransactionEntity, (transaction) => transaction.targetUser, { lazy: true })
  receivedTransactions: Promise<TransactionEntity[]>;
  @OneToMany(() => BucketValidatorEntity, (validatingBucket) => validatingBucket.user, { lazy: true })
  validatingBuckets: Promise<BucketValidatorEntity[]>;

  static readonly construct = constructFactoryFn<UserEntity, ModelData<UserEntity>>(UserEntity);
}
