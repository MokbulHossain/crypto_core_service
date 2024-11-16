import {
    Table,
    Column,
    Model,
    DataType,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'subscriber_map' })
  export class SubscriberMapModel extends Model {
    @Column({
      type: DataType.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    })
    id: bigint;
    
    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    user_id: bigint;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    subscriber_id: bigint;

    @Column({
        type: DataType.DATE,
        defaultValue: new Date()
    })
    created_at: Date
  }