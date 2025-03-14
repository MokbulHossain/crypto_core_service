import {
    Table,
    Column,
    Model,
    DataType,
    Sequelize
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'daily_spin_claimed_map' })
  export class DailySpinClaimedMapModel extends Model {
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
        type: DataType.STRING(30)
    })
    reward_type: string

    @Column({
        type: DataType.DOUBLE
    })
    reward_amount: number

    @Column({
        type: DataType.INTEGER
    })
    rest_spin: number

    @Column({
        type: DataType.STRING(30)
    })
    spin_type: string
  }