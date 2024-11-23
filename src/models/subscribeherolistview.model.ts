import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'subscribeherolistview' })

export class SubscribeHeroListViewModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    user_id: bigint;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    subscriber_id: bigint;

    @Column({
        type: DataType.TEXT
    })
    email: string;

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
        type: DataType.FLOAT
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
        type: DataType.STRING
    })
    tier_name: string;

    @Column({
        type: DataType.STRING
    })
    tier_icon: string;

    @Column({
        type: DataType.STRING
    })
    country_name: string;

    @Column({
        type: DataType.STRING
    })
    flag_url: string;

    @Column({
        type: DataType.DATE
    })
    subscribe_at: Date

    @Column({
        type: DataType.TEXT
    })
    bio: string
}
