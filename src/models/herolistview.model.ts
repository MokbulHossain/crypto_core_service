import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'herolistview' })

export class HeroListViewModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    user_id: bigint;

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
    roi: number;

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

}
