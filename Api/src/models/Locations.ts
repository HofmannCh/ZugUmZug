import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class Location extends Model { }
Location.init({
  Id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  DateTime: {
    type: DataType.DATE,
    allowNull: false,
    field: 'DateTime'
  },
  Lat: {
    type: DataType.FLOAT,
    allowNull: false,
    field: 'Lat'
  },
  Lng: {
    type: DataType.FLOAT,
    allowNull: false,
    field: 'Lng'
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
  tableName: 'Locations'
});
export default Location
