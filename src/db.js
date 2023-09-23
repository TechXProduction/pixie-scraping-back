
require('dotenv').config({path: './.env'});
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { POSTGRES_URL } = process.env;



// Seteamos la Base de datos con sus configuraciones
//seteamos las cosas
let sequelize =
new Sequelize(
     `postgres://pixie:idgEDLlJ9QxxW7AlkD7gojAV3d0lRFzA@dpg-ck7ior7q54js73ft3a80-a.oregon-postgres.render.com/pixie_5n7g?sslmode=require`,
     /* { dialectModule: require('pg') },
     */);

const basename = path.basename(__filename);

const modelDefiners = [];

fs
 .readdirSync(path.join(__dirname, '/models'))
 .filter(
  (file) =>
   file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
 )
 .forEach((file) => {
  modelDefiners.push(require(path.join(__dirname, '/models', file)));
 });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
 entry[0][0].toUpperCase() + entry[0].slice(1),
 entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Importamos los models

const { Parcela, Intercepto, Contador, User, Vivienda, Expediente, Acto } =
 sequelize.models;

// Insertar las Relaciones (de momento no hay)

Expediente.hasMany(Acto);
Acto.belongsTo(Expediente);

module.exports = {
 ...sequelize.models,
 db: sequelize,
};
