const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "parcela",
    {
      id: {
        type: DataTypes.FLOAT,
        primaryKey: true,
        allowNull: false,
      },
      OBJECTID: {
        type: DataTypes.FLOAT,
      },
      RM: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      NCN: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      LOTE: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      CCAT: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      NOF: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      OBSERVACIO: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      USO: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      OBS_CAMPO: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      MANZANA: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      FECHA_MOV: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      MODIFICO: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CVE_CAT_ES: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      SHAPE_AREA: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      SHAPE_LEN: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      PRKCCLAVEC: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      // ESTA ES PIT
      PROPIE: {
        type: DataTypes.STRING,
      },
      AREA: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      ESTADO: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CVECATAS: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      // CALLE
      UBICACION: {
        type: DataTypes.STRING,
      },
      NUMOFI: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      COLONIA: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CP: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      POBLACION: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      RAZONSOCIA: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      ESTADO_1: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CVECATAS_1: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      NOTIFICAR: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      COL: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      POB: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      TIPOPR: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      STATUSLEGA: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      ANOTACION: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      RPP: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      REGIMEN: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CVECATAS_2: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      TERRENO: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      TOTAL: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      ESTADO_12: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CVECATAS_3: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      SUPERFICIE: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      VTOTAL: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      ESTADO__13: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CVECATAS_4: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      CONSTR: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      VALTOT: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      CVECATAS_5: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      NUMREGPUB: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
      FECHAREGPU: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      NUMESCRITU: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      geometry: {
        allowNull: true,
        type: DataTypes.GEOMETRY("MultiPolygon", 4326), // (Por Defecto: 4326, Hermosillo?: 32613, 3857 <- este VA)  Especifica el tipo de geometría y el sistema de referencia espacial (SRID)
      },
    },
    {
      timestamps: false,
    }
  );
};
