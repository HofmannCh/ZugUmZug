import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class Event extends Model { }
Event.init({
  Id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Date: {
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'Date'
  },
  LocationName: {
    type: DataType.STRING(20),
    allowNull: false,
    field: 'LocationName'
  },
  Description: {
    type: DataType.TEXT,
    allowNull: true,
    field: 'Description'
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
  }
}, {
  sequelize: db,
  tableName: 'Events'
});
export default Event