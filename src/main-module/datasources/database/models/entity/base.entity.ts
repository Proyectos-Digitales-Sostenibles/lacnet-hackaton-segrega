import { Column, CreateDateColumn, DeleteDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface IBasicBaseEntity {
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface IBaseEntity extends IBasicBaseEntity {
  id?: number;
}

export class BaseEntity implements IBaseEntity {
  constructor(data?: Partial<BaseEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid?: string;

  @CreateDateColumn({ name: 'createdat', type: 'timestamp', precision: 3 })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedat', type: 'timestamp', precision: 3 })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedat', type: 'timestamp', precision: 3 })
  deletedAt?: Date;
}
