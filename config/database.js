const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mlm_1', 'admin', 'ViJ61Mbenf6bXx6j88aPGHVQNioAfgHo', {
  host: 'dpg-cle5irvpc7cc73eleu80-a',
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
