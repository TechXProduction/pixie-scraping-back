const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('vivienda', {
        M2: {
            allowNull: false,
            type: DataTypes.FLOAT,
          },
        M2_Construccion:{
            allowNull: false,
            type:DataTypes.FLOAT,
            
        },
        Ubicacion:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        COS:{
            allowNull: false,
            type:DataTypes.FLOAT,
        },
        CUS:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Seguridad:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_Cuartos:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        No_banos:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Dos_Plantas:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        M2_Cochera:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_2ton:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_1_5ton:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_1ton:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_recamaras:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Nivel_Socioeconomico:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Opinion_Valor_Precio_Final:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Domicilio:{
            type: DataTypes.STRING,
            allowNull:false
        },
        Edad:{
            type: DataTypes.FLOAT,
            allowNull:false
        }
    }, {
        timestamps: true,
    });
};