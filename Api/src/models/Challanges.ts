import {Table, Column, Model, HasMany, DataType} from 'sequelize-typescript';
import db from "@lib/database"

@Table
class Challange extends Model {}
Challange.init({
  Id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Name: {
    type: DataType.STRING(20),
    allowNull: false,
    field: 'Name'
  },
  Description: {
    type: DataType.TEXT,
    allowNull: false,
    field: 'Description'
  },
  Points: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'Points'
  },
  EventId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'Id'
    },
    field: 'EventId'
  }
}, {
  sequelize: db,
  tableName: 'Challanges'
})
export default Challange
