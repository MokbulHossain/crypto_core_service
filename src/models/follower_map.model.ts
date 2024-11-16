import {
    Table,
    Column,
    Model,
    DataType,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'follower_map' })
  export class FollowerMapModel extends Model {
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
    follower_id: bigint;

    @Column({
        type: DataType.DATE,
        defaultValue: new Date()
    })
    created_at: Date
  }