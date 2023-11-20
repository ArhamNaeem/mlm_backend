const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  MemberID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: DataTypes.STRING,
  JoiningDate: DataTypes.DATE,
  Balance: DataTypes.DECIMAL(10, 2),
  AvailableBalance: {type: DataTypes.DECIMAL(10, 2), defaultValue: 0,}, // Set the default value for the AvailableBalance column
  DirectCommision: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Set the default value for the Direct Commision column
  },
  Email: {
    type: DataTypes.STRING,
    unique: true, // Make the Email field unique
  },
  Phone: DataTypes.STRING,
  Address: DataTypes.TEXT,
    Password: DataTypes.STRING, // Add the Password field
    Level: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Set the default value for the "Level" column
    },
  // Add the returning option
}, {
  returning: true, // Include this option to return the updated instance
});

module.exports = Member;



 // Password: DataTypes.STRING, // Add the Password field
  // Level: {
  //   type: DataTypes.INTEGER,
  //   defaultValue: 1, // Set the default value for the "Level" column
  // },