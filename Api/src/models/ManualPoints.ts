import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class ManualPoint extends Model { }
ManualPoint.init({
  Id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Points: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'Points'
  },
  Reason: {
    type: DataType.TEXT,
    allowNull: false,
    field: 'Reason'
  },
  GroupId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'Id'
    },
    field: 'GroupId'
  }
}, {
  sequelize: db,
  tableName: 'ManualPoints'
});
export default ManualPoint
