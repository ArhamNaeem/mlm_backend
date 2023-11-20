const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  AdminID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: DataTypes.STRING,
  Username: DataTypes.STRING,
  Password: DataTypes.STRING,
  Email: {
    type: DataTypes.STRING,
    unique: true, // Make the Email field unique
  },
  Role: DataTypes.STRING,
});

module.exports = Admin;
