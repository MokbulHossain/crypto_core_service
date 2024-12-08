import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import { SignalViewModel } from './signalview.model';
@Table({ tableName: 'signal_unlock_map' })

export class SignalUnlockMapModel extends Model{
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
    signal_id: bigint;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    unlocked_by_user_id: bigint;

    @Column({
        type: DataType.DATE,
        defaultValue: new Date()
    })
    unlocked_at: Date
}