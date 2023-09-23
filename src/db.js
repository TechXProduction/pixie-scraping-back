
require('dotenv').config({path: './.env'});
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { POSTGRES_URL } = process.env;



// Seteamos la Base de datos con sus configuraciones

let sequelize =
new Sequelize(
     `postgres://default:Pe5NxWbEB8gn@ep-weathered-truth-74233848-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require`,
     { logging: false, native: false },
    );

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
