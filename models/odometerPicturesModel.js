const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Member = require('../models/membersModel'); // Adjust the path if necessary
const OdometerPicture = sequelize.define('OdometerPicture', {
  PictureID: {
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
  OdometerPicture: DataTypes.BLOB,

  SubmissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Set default value to current date
  },
  ApprovalStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  MimeType: {
    type: DataTypes.STRING // This field will store the MIME type
  },
  ReasonForRejection: DataTypes.TEXT,
  Distance: DataTypes.INTEGER
});

OdometerPicture.sync();

// Define the association between OdometerPictures and Members
OdometerPicture.belongsTo(Member, { foreignKey: 'MemberID' });

module.exports = OdometerPicture;