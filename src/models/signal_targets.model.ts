import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import { SignalViewModel } from './signalview.model';
@Table({ tableName: 'signal_targets' })

export class SignalTargetModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @ForeignKey(() => SignalViewModel)
    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    signal_id: bigint;

    @Column({
        type: DataType.FLOAT,
        defaultValue: 0
    })
    target: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1
    })
    status: number
}