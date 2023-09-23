const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('intercepto', {
        Intercepto:{
            allowNull: false,
            type: DataTypes.FLOAT,
        },
        M2: {
            allowNull: false,
            type: DataTypes.FLOAT,
          },
        M2_Construccion:{
            allowNull: false,
            type:DataTypes.FLOAT,
            
        },
        COS:{
            allowNull: false,
            type:DataTypes.FLOAT,
        },
        CUS:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_Cuartos:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_banos:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        M2_Cochera:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_recamaras:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Seguridad:{
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
        Ubicacion_1:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Ubicacion_2:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Ubicacion_3:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Ubicacion_4:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Ubicacion_5:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Dos_Plantas_0:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Dos_Plantas_1:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Nivel_Socioeconomico_1:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Nivel_Socioeconomico_2:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Nivel_Socioeconomico_3:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Nivel_Socioeconomico_4:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Edad:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        M2_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        M2_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        M2_Construccion_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        M2_Construccion_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        COS_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        COS_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        CUS_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        CUS_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Edad_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Edad_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_Cuartos_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_Cuartos_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_banos_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_banos_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        M2_Cochera_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        M2_Cochera_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_recamaras_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        No_recamaras_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Seguridad_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Seguridad_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_2ton_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_2ton_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_1_5ton_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_1_5ton_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_1ton_resta:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        minisplit_1ton_division:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        
        

        
    }, {
        timestamps: true,
    });
};