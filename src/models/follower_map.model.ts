import {
    Table,
    Column,
    Model,
    DataType,
    Sequelize
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
        defaultValue: Sequelize.fn('NOW') // Use database's current timestamp
    })
    created_at: Date
  }