const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DB_CONNECTION_STRING);

module.exports = db;
