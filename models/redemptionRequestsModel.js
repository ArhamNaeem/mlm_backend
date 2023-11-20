const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Member = require('./membersModel'); // Adjust the path if necessary
const RedemptionRequest = sequelize.define('RedemptionRequest', {
  RequestID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MemberID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Members',
      key: 'MemberID',
    },
  },
  RequestDate: DataTypes.DATE,
  PointsRequested: DataTypes.INTEGER,
  RequestType: DataTypes.STRING,
  Status: DataTypes.STRING,
  AdminID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Admins',
      key: 'AdminID',
    },
  },
});

// Define the association between RedemptionRequests and Members
RedemptionRequest.belongsTo(Member, { foreignKey: 'MemberID' });

module.exports = RedemptionRequest;
