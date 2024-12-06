import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'signals' })

export class SignalModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    user_id: bigint;

    @Column({
        type: DataType.TEXT,
        defaultValue: 'Free'
    })
    package_type: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    coin_type_id: number;

    @Column({
        type: DataType.STRING
    })
    signal_type: string;

    @Column({
        type: DataType.STRING
    })
    signal_sub_type: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    leverage: number

    @Column({
        type: DataType.FLOAT
    })
    entry_price: number

    @Column({
        type: DataType.STRING
    })
    risk_type: string

    @Column({
        type: DataType.DATE,
        defaultValue: new Date()
    })
    created_at: Date

    @Column({
        type: DataType.FLOAT
    })
    stop_loss_price: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1
    })
    status: number
}