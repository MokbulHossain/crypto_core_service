import {
    Table,
    Column,
    Model,
    DataType,
    Sequelize
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'daily_reward_claimed_map' })
  export class DailyRewardClaimedMapModel extends Model {
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
    campaign_id: bigint;

    @Column({
        type: DataType.DATE,
        defaultValue: Sequelize.fn('NOW') // Use database's current timestamp
    })
    created_at: Date

    @Column({
        type: DataType.SMALLINT
    })
    day_no: number

    @Column({
        type: DataType.STRING(30)
    })
    reward_type: string

    @Column({
        type: DataType.DOUBLE
    })
    reward_amount: number
  }