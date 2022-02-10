const { DataTypes } = require('sequelize');
const db = require('../db');

const FoodLog = db.define('foodlog', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  food: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  owner_id: {
    type: DataTypes.INTEGER,
  },
});

module.exports = FoodLog;
