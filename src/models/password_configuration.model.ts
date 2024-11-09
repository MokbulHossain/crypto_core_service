import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'password_configuration' })

export class PasswordConfigModel extends Model{
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
    expire_date_length: Number;

    @Column({
        type: DataType.INTEGER
    })
    length: Number;

    @Column({
        type: DataType.BOOLEAN
    })
    is_special_charecter: Boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    islowercase: Boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    isnumber: Boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    isuppercase: Boolean;
}