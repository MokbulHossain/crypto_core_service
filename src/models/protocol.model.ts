import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'protocol' })

export class ProtocolModel extends Model{
    @Column({
        type: DataType.SMALLINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: Number;

    @Column({
        type: DataType.INTEGER
    })
    login_attempt_interval_minutes: Number;

    @Column({
        type: DataType.INTEGER
    })
    login_max_retry: Number;

    @Column({
        type: DataType.INTEGER
    })
    resend_otp_interval_minutes: Number;

    @Column({
        type: DataType.INTEGER
    })
    otp_expiry_minutes: Number;
}