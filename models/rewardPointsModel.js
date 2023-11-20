const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Member = require('./membersModel'); // Adjust the path if necessary
const RewardPoints = sequelize.define('RewardPoints', {
  RewardPointID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MemberID: DataTypes.INTEGER, // References the Member table
  Points: DataTypes.INTEGER,
  ActivityDate: DataTypes.DATE,
  Distance: DataTypes.INTEGER,
});

// Define the association between RewardPoints and Members
RewardPoints.belongsTo(Member, { foreignKey: 'MemberID' });

module.exports = RewardPoints;
