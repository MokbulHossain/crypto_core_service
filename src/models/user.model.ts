import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'users' })

export class UserModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT
    })
    email: string;

    @Column({
        type: DataType.TEXT
    })
    username: string;

    @Column({
        type: DataType.TEXT
    })
    password: string;

    @Column({
        type: DataType.TEXT
    })
    name: string;

    @Column({
        type: DataType.TEXT
    })
    image: string;

    @Column({
        type: DataType.BIGINT
    })
    mobile: number

    @Column({
        type: DataType.FLOAT
    })
    win_ratio: number;

    @Column({
        type: DataType.FLOAT
    })
    win_ratio_free: number;

    @Column({
        type: DataType.FLOAT
    })
    win_ratio_premium: number;

    @Column({
        type: DataType.DOUBLE
    })
    roi: number;

    @Column({
        type: DataType.DOUBLE
    })
    roi_free: number;

    @Column({
        type: DataType.DOUBLE
    })
    roi_premium: number;
    
    @Column({
        type: DataType.INTEGER
    })
    tier_id: number;

    @Column({
        type: DataType.DATE,
        defaultValue: new Date()
    })
    registrtiondate: Date;

    @Column({
        type: DataType.SMALLINT
    })
    status: number;

    @Column({
        type: DataType.FLOAT
    })
    hero_coin: number;

    @Column({
        type: DataType.FLOAT
    })
    champion_coin: number;

    @Column({
        type: DataType.FLOAT
    })
    gems_coin: number

    @Column({
        type: DataType.DOUBLE
    })
    lat: number;

    @Column({
        type: DataType.DOUBLE
    })
    long: number;

    @Column({
        type: DataType.INTEGER
    })
    countries_id: number;

    @Column({
        type: DataType.DATE
    })
    locked_at: Date;

    @Column({
        type: DataType.TEXT
    })
    bio: string

    @Column({
        type: DataType.INTEGER
    })
    follower:number

    @Column({
        type: DataType.TEXT
    })
    refer_code: string

    @Column({
        type: DataType.TEXT
    })
    used_refer_code: string

    @Column({
        type: DataType.FLOAT,
        defaultValue: 0
    })
    subscription_charge: number
}
