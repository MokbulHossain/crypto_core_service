import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'countries' })

export class CountriesModel extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: number;

    @Column({
        type: DataType.TEXT
    })
    country_name: String;

    @Column({
        type: DataType.TEXT
    })
    country_code: String;

    @Column({
        type: DataType.TEXT
    })
    mobile_prefix: String;

    @Column({
        type: DataType.TEXT
    })
    mobile_prefix_without_plus: String;

    @Column({
        type: DataType.SMALLINT
    })
    mobile_length: number;

    @Column({
        type: DataType.TEXT
    })
    flag_url: String;
}
