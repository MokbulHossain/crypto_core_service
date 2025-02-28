import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, Sequelize } from 'sequelize-typescript';

@Table({ tableName: 'users_temp' })

export class UserTempModel extends Model{
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
        type: DataType.INTEGER
    })
    tier_id: number;

    @Column({
        type: DataType.DATE,
        defaultValue: Sequelize.fn('NOW') // Use database's current timestamp
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
    used_refer_code: string

}
