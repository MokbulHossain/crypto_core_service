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
        type: DataType.INTEGER
    })
    tier_id: Number;

    @Column({
        type: DataType.DATE,
        defaultValue: new Date()
    })
    registrtiondate: Date;

    @Column({
        type: DataType.SMALLINT
    })
    status: Number;

    @Column({
        type: DataType.FLOAT
    })
    hero_coin: Number;

    @Column({
        type: DataType.FLOAT
    })
    champion_coin: Number;

    @Column({
        type: DataType.DOUBLE
    })
    lat: Number;

    @Column({
        type: DataType.DOUBLE
    })
    long: Number;

    @Column({
        type: DataType.INTEGER
    })
    countries_id: Number;

    @Column({
        type: DataType.DATE
    })
    locked_at: Date;

}
