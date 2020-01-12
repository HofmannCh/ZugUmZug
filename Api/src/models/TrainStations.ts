import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class TrainStation extends Model { }
TrainStation.init({
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
  Image: {
    type: "VARBINARY(45)",
    allowNull: false,
    field: 'Image'
  },
  Valid: {
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'Valid'
  },
  GroupId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'Id'
    },
    field: 'GroupId'
  },
  UserId: {
    type: DataType.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'Id'
    },
    field: 'UserId'
  }
}, {
  sequelize: db,
  tableName: 'TrainStations'
});
export default TrainStation