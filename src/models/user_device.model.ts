import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'user_device' })

export class UserDeviceModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @Column({
        type: DataType.BIGINT
    })
    user_id: bigint;

    @Column({
        type: DataType.TEXT
    })
    email: string;
    
    @Column({
        type: DataType.TEXT
    })
    device_id: string;

    @Column({
        type: DataType.TEXT
    })
    fcm: string;

    @Column({
        type: DataType.TEXT
    })
    otp: string;

    @Column({
        type: DataType.DATE
    })
    otp_createdat: Date;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    otp_used: Boolean;

    @Column({
        type: DataType.SMALLINT,
        defaultValue: 0
    })
    total_attempt:number

    @Column({
        type: DataType.TEXT,
        defaultValue: 'LOGIN'
    })
    otp_type:String

    @Column({
        type: DataType.TEXT
    })
    handset_type: string;

    @Column({
        type: DataType.TEXT
    })
    osversion: string;

    @Column({
        type: DataType.TEXT
    })
    phone_model: string;
}