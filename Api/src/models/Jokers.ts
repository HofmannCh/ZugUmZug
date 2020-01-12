import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class Jokers extends Model { }
Jokers.init({
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
  From: {
    type: DataType.DATE,
    allowNull: true,
    field: 'From'
  },
  Till: {
    type: DataType.DATE,
    allowNull: false,
    field: 'Till'
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
  MinPoints: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'MinPoints'
  },
  MaxPoints: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'MaxPoints'
  },
  UserId: {
    type: DataType.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'Id'
    },
    field: 'UserId'
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
  tableName: 'Jokers'
});
export default Jokers