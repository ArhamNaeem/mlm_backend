const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = require('./membersModel'); // Adjust the path if necessary

const Commission = sequelize.define('Commission', {
  CommissionID: {
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
  CommissionAmount: DataTypes.DECIMAL(10, 2),
  CommissionDate: DataTypes.DATE,
});



// Define the association between Commissions and Members
Commission.belongsTo(Member, { foreignKey: 'MemberID' });



module.exports = Commission;
