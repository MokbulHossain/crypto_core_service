import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { SignalTargetModel } from './signal_targets.model';

@Table({ tableName: 'signal_view' })

export class SignalViewModel extends Model{
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
    hero_id: bigint;

    @Column({
        type: DataType.STRING
    })
    hero_name: string;

    @Column({
        type: DataType.STRING
    })
    hero_image: string;

    @Column({
        type: DataType.STRING
    })
    hero_username: string;

    @Column({
        type: DataType.TEXT,
        defaultValue: 'Free'
    })
    package_type: string;

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

    @Column({
        type: DataType.STRING
    })
    coin_name: string;

    @Column({
        type: DataType.STRING
    })
    coin_logo: string;

    @HasMany(() => SignalTargetModel)
    signal_target: SignalTargetModel[]
}