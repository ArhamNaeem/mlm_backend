const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Member = require('./membersModel'); // Adjust the path if necessary
const Recruit = sequelize.define('Recruit', {
  RecruitID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MemberID: {
    type: DataTypes.INTEGER,
    allowNull: true, // This allows the field to be null
    references: {
      model: 'Members',
      key: 'MemberID',
      
    },
  },
  RecruitMemberID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Members',
      key: 'MemberID',
    },
  },
  JoiningDate: DataTypes.DATE,
});

// Define the association between Recruits and Members for both MemberID and RecruitMemberID
Recruit.belongsTo(Member, { foreignKey: 'MemberID', as: 'Sponsor' });
Recruit.belongsTo(Member, { foreignKey: 'RecruitMemberID', as: 'Recruit' });

module.exports = Recruit;
