import {
    Table,
    Column,
    Model,
    DataType,
  } from 'sequelize-typescript';
  import { Expose, Transform } from 'class-transformer';

  @Table({ tableName: 'user_refer_map_listview' })
  export class UserReferMapListviewModel extends Model {
    @Column({
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.BIGINT,
    get() {
      const value = this.getDataValue('id');
      return value ? parseInt(value, 10) : null;
    },
    })

    id: number;
    
    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    user_id: bigint;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    refer_user_id: bigint;

    @Column({
        type: DataType.TEXT
    })
    refer_code: string

    @Column({
        type: DataType.TEXT
    })
    refer_username: string

    @Column({
        type: DataType.TEXT
    })
    name: string

    @Column({
        type: DataType.FLOAT
    })
    spent_gem: number

    @Column({
        type: DataType.FLOAT
    })
    earning: number
  }