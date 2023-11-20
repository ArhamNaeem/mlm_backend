const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mlm_1', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
});


sequelize.sync()
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch(err => {
    console.error('Error creating database:', err);
  });

module.exports = sequelize;
