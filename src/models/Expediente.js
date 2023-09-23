const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
 sequelize.define(
  'expediente',
  {
   id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
   },
   año: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   expediente: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   juzgado: {
    type: DataTypes.STRING,
    allowNull: false,
   },
  },
  {
   timestamps: false,
  },
 );
};
