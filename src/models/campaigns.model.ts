import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaigns' })

export class CampaignModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @Column({
        type: DataType.STRING(30)
    })
    keyword: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    type: string;

    @Column({
        type: DataType.TEXT
    })
    icon: string;

    @Column({
        type: DataType.TEXT
    })
    title: string;

    @Column({
        type: DataType.TEXT
    })
    details: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    reward_type: string;
    
    @Column({
        type: DataType.FLOAT
    })
    reward_amount: number;

    @Column({
        type: DataType.DATE,
        defaultValue: new Date()
    })
    created_at: Date

}