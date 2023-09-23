const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "acto",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      fecha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secretaria: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      asunto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      partes: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sintesis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
