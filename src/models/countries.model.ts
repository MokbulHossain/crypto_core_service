import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'countries' })

export class CountriesModel extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: Number;

    @Column({
        type: DataType.TEXT
    })
    name: String;

    @Column({
        type: DataType.TEXT
    })
    code: String;
}