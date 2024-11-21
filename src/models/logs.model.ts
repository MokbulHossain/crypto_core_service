import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'logs' })
export class LogModel extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING(255),
  })
  level: string;
  @Column({
    type: DataType.STRING(255),
  })
  label: string;
  @Column({
    type: DataType.TEXT,
  })
  message: string;
  @Column({
    type: DataType.DATE,
  })
  createdAt: string;
  @Column({
    type: DataType.TEXT,
    defaultValue: process.env.SERVICE_NAME || 'nestjs_core'
  })
  appname: string;

  @Column({
    type: DataType.TEXT,
  })
  transactionid:string
  
}