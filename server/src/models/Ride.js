import { DataTypes } from 'sequelize';

export function createRideModel(sequelize) {
  const Ride = sequelize.define(
    'Ride',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      driverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      startLocation: { type: DataTypes.STRING(255), allowNull: false },
      destination: { type: DataTypes.STRING(255), allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      time: { type: DataTypes.STRING(20), allowNull: false },
      seatsAvailable: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 0 } },
    },
    {
      tableName: 'rides',
      indexes: [
        { fields: ['driverId'] },
        { fields: ['startLocation'] },
        { fields: ['destination'] },
        { fields: ['date'] },
      ],
    }
  );
  return Ride;
}

