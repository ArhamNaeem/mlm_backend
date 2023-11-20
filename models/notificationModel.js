const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = require('./membersModel'); // Adjust the path if necessary


const Notification = sequelize.define('Notification', { 
    MemberID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Members',
          key: 'MemberID',
        } 
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  
// Define the association between Commissions and Members
Notification.belongsTo(Member, { foreignKey: 'MemberID' });

module.exports = Notification;