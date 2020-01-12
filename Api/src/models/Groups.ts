import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class Group extends Model { }
Group.init({
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
  Uuid: {
    type: DataType.STRING(500),
    allowNull: false,
    field: 'Uuid'
  },
  Description: {
    type: DataType.STRING(500),
    allowNull: true,
    field: 'Description'
  },
  Users: {
    type: DataType.STRING(500),
    allowNull: false,
    field: 'Users'
  },
  BasisUserId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'Id'
    },
    field: 'BasisUserId'
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
  tableName: 'Groups'
});
export default Group