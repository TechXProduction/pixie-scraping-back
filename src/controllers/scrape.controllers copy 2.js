const { Op } = require('sequelize');
const { juzgados, anios } = require('../utils/juzgados');
const HacerBusqueda = require('../utils/bot.js');

const { Parcela } = require('../db');
const { Actos } = require('../db');
// const Json1 = require('../utils/JSON1.json');
// const Json2 = require('../utils/JSON2.json');
// const Json3 = require('../utils/JSON3.json');

////////////////////////////////////////////////////////

async function mapper(req, res) {
 const numeroExpediente = req.body.asunto;
 const anio = req.body.año;
 const titular = req.body.nombre;

 async function buildWhereClause(titular) {
  // Convertir el nombre a mayúsculas y reemplazar múltiples espacios por un solo espacio
  titular = titular.toUpperCase().replace(/\s+/g, ' ');

  // Dividir el nombre en partes individuales
  const partesNombre = titular.split(' ');

  // Variable para almacenar las condiciones de búsqueda
  const conditions = [];

  // Recorrer cada parte del nombre
  for (let i = 0; i < partesNombre.length; i++) {
   const parteNombre = partesNombre[i];

   // Agregar la condición para comprobar si la parte del nombre está incluida en el campo PROPIE
   conditions.push({
    PROPIE: {
     [Op.like]: `%${parteNombre}%`,
    },
   });
  }

  // Devolver la cláusula where generada solo si hay 2 o más coincidencias
  return {
   [Op.or]: [
    {
     [Op.and]: conditions,
    },
   ],
  };
 }

 let findDb = [];

 try {
  const whereClause = await buildWhereClause(titular);

  findDb = await Parcela.findAll({
   where: whereClause,
  });

  // res.send(result);
 } catch (err) {
  console.log(err.message);
  res.status(500).send({ message: err.message });
 }

 const resultadoScraping = await GetExpedientes(
  juzgados,
  titular,
  numeroExpediente,
  anio,
 );

 function flattenResults(array) {
  let flattened = [];
  for (let i = 0; i < array.length; i++) {
   const element = array[i];
   if (Array.isArray(element)) {
    flattened = flattened.concat(flattenResults(element));
   } else if (element !== undefined) {
    flattened.push(element);
   }
  }
  return flattened;
 }

 const finalResults = flattenResults(resultadoScraping);
 const response = finalResults.length > 0 ? finalResults : undefined;
 res.json({ scrapingResult: response, dbResult: findDb });
}

async function GetExpedientes(juzgado, titular, numeroExpediente, anio) {
 if (
  (numeroExpediente === '' || numeroExpediente === null) &&
  (anio === '' || anio === null)
 ) {
  // No le llega año ni n° de exp
  let response = [];
  console.log('Ambas variables son cadenas vacías');
  let res = busquedaSinInfo(juzgado, titular, (check = 1));
  response.push(res);
  return response;
 } else if (numeroExpediente === '' || numeroExpediente === null) {
  // Le llega solo año
  let response = [];
  console.log('La variable "numeroExpediente" es una cadena vacía');
  for (let i = 0; i < juzgados.length; i++) {
   const j = juzgados;
   console.log('JUZGADO N° ', i + 1, 'de', j[i]);
   let res = await busquedaConAño(j[i], titular, anio, (check = 2));
   response.push(res);
  }
  return response;
 } else if (anio === '' || anio === null) {
  // Le llega solo n° exp
  let response = [];
  console.log('La variable "anio" es una cadena vacía');
  for (let i = 0; i < juzgados.length; i++) {
   const j = juzgados;
   console.log('JUZGADO N° ', i + 1, 'de', j[i]);
   let res = await busquedaConExp(j[i], titular, numeroExpediente, (check = 3));
   response.push(res);
  }
  return response;
 } else {
  // Le llegan todos los parámetros
  console.log('No se cumple ninguna condición');
  let response = [];
  const j = [];
  for (let i = 0; i < juzgados.length; i += 5) {
   j.push(juzgados.slice(i, i + 5));
  }
  for (let i = 0; i < j.length; i++) {
   console.log('ITERACION N° ', i + 1, 'de', j[i]);
   let res = await busquedaConTodo(
    j[i],
    titular,
    numeroExpediente,
    anio,
    (check = 4),
   );
   //  console.log('ESTO TENDRIA QUE TENER ALGO', res);
   if (res.length !== 0) response.push(res);
  }
  return response;
 }
}

async function busquedaConTodo(
 juzgado,
 titular,
 numeroExpediente,
 anio,
 check,
) {
 //  let res = [];
 let response = await HacerBusqueda(
  juzgado,
  titular,
  numeroExpediente,
  anio,
  check,
 );
 //  res.concat(response);
 return response;
}

async function busquedaSinInfo(juzgado, titular, check) {
 let res = [];
 for (let index = 0; index < anios.length; index++) {
  for (let i = 1; i < 9999; i++) {
   let a = i.toString().padStart(4, '0');
   if (a.length == 4) {
    let response = await HacerBusqueda(
     juzgado,
     titular,
     a,
     anios[index],
     check,
    );
    res.push(response);
   }
  }
 }
 return res;
}

async function busquedaConExp(juzgado, titular, numeroExpediente, check) {
 let res = [];
 const n = [];
 for (let i = 0; i < anios.length; i += 5) {
  n.push(anios.slice(i, i + 5));
 }
 for (let index = 0; index < n.length; index++) {
  // n = anios[index];
  console.log('n° exp', numeroExpediente);
  console.log('años ', n[index]);
  let response = await HacerBusqueda(
   juzgado,
   titular,
   numeroExpediente,
   n[index],
   check,
  );
  console.log('meta urAAA', response);
  res.push(response);
 }
 return res;
}

async function busquedaConAño(juzgado, titular, anio, check) {
 // buscar la forma de pasarle varios años por iteracion
 let res = [];
 for (let i = 1; i < 9999; i++) {
  let a = i.toString().padStart(4, '0');
  console.log('año', anio);
  if (a.length == 4) {
   let response = await HacerBusqueda(juzgado, titular, a, anio, check);
   res.push(response);
  }
 }
 return res;
}

// async function busquedaConAño(juzgado, titular, anio, check) {
//  let res = [];
//  let expedientes = []; // Lista de expedientes
//  let expedienteCount = 10; // Número de expedientes por grupo
//  let maxExpediente = 99;

//  // Generar la lista de expedientes
//  for (let i = 1; i <= maxExpediente; i++) {
//   let a = i.toString().padStart(4, '0');
//   if (a.length == 4) {
//    expedientes.push(a);
//   }
//  }

//  // Procesar los expedientes en grupos de expedienteCount
//  for (let i = 0; i < expedientes.length; i += expedienteCount) {
//   let batchExpedientes = expedientes.slice(i, i + expedienteCount);
//   let batchPromises = [];

//   // Ejecutar las búsquedas en paralelo
//   for (let j = 0; j < batchExpedientes.length; j++) {
//    let expediente = batchExpedientes[j];
//    let response = HacerBusqueda(juzgado, titular, expediente, anio, check);
//    batchPromises.push(response);
//   }

//   // Esperar a que se completen todas las búsquedas del grupo
//   let batchResponses = await Promise.all(batchPromises);
//   res = res.concat(batchResponses);

//   // Verificar si se alcanzó el valor máximo de expediente
//   if (batchExpedientes.includes(maxExpediente.toString())) {
//    break;
//   }
//  }

//  return res;
// }

async function fillDb() {
 //  for (let i = 0; i < Json.features.length; i++) {
 //   // const resultadoDb = async () => {
 //   //  try {
 //   console.log('Parcela n° ', Json.features[i].id);
 //   const geometry = Json.features[i].geometry;
 //   const geometryTransform = db.literal(
 //    `ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(
 //     geometry,
 //    )}'), 3857), 4326)`,
 //   );
 //   const type = geometry.type;
 //   const coordinates = geometry.coordinates;
 //   console.log('Geometry ', geometry);
 //   console.log('Coordenadas ', coordinates);
 //   await Parcela.create({
 //    id: Json.features[i].id,
 //    OBJECTID: Json.features[i].properties.OBJECTID,
 //    RM: Json.features[i].properties.RM,
 //    NCN: Json.features[i].properties.NCN,
 //    LOTE: Json.features[i].properties.LOTE,
 //    CCAT: Json.features[i].properties.CCAT,
 //    NOF: Json.features[i].properties.NOF,
 //    OBSERVACIO: Json.features[i].properties.OBSERVACIO,
 //    USO: Json.features[i].properties.USO,
 //    OBS_CAMPO: Json.features[i].properties.OBS_CAMPO,
 //    MANZANA: Json.features[i].properties.MANZANA,
 //    FECHA_MOV: Json.features[i].properties.FECHA_MOV,
 //    MODIFICO: Json.features[i].properties.MODIFICO,
 //    CVE_CAT_ES: Json.features[i].properties.CVE_CAT_ES,
 //    SHAPE_AREA: Json.features[i].properties.SHAPE_AREA,
 //    SHAPE_LEN: Json.features[i].properties.SHAPE_LEN,
 //    PRKCCLAVEC: Json.features[i].properties.PRKCCLAVEC,
 //    PROPIE: Json.features[i].properties.PROPIE,
 //    AREA: Json.features[i].properties.AREA,
 //    ESTADO: Json.features[i].properties.ESTADO,
 //    CVECATAS: Json.features[i].properties.CVECATAS,
 //    UBICACION: Json.features[i].properties.UBICACION,
 //    NUMOFI: Json.features[i].properties.NUMOFI,
 //    COLONIA: Json.features[i].properties.COLONIA,
 //    CP: Json.features[i].properties.CP,
 //    POBLACION: Json.features[i].properties.POBLACION,
 //    RAZONSOCIA: Json.features[i].properties.RAZONSOCIA,
 //    ESTADO_1: Json.features[i].properties.ESTADO_1,
 //    CVECATAS_1: Json.features[i].properties.CVECATAS_1,
 //    NOTIFICAR: Json.features[i].properties.NOTIFICAR,
 //    COL: Json.features[i].properties.COL,
 //    POB: Json.features[i].properties.POB,
 //    TIPOPR: Json.features[i].properties.TIPOPR,
 //    STATUSLEGA: Json.features[i].properties.STATUSLEGA,
 //    ANOTACION: Json.features[i].properties.ANOTACION,
 //    RPP: Json.features[i].properties.RPP,
 //    REGIMEN: Json.features[i].properties.REGIMEN,
 //    CVECATAS_2: Json.features[i].properties.CVECATAS_2,
 //    TERRENO: Json.features[i].properties.TERRENO,
 //    TOTAL: Json.features[i].properties.TOTAL,
 //    ESTADO_12: Json.features[i].properties.ESTADO_12,
 //    CVECATAS_3: Json.features[i].properties.CVECATAS_3,
 //    SUPERFICIE: Json.features[i].properties.SUPERFICIE,
 //    VTOTAL: Json.features[i].properties.VTOTAL,
 //    ESTADO__13: Json.features[i].properties.ESTADO__13,
 //    CVECATAS_4: Json.features[i].properties.CVECATAS_4,
 //    CONSTR: Json.features[i].properties.CONSTR,
 //    VALTOT: Json.features[i].properties.VALTOT,
 //    CVECATAS_5: Json.features[i].properties.CVECATAS_5,
 //    NUMREGPUB: Json.features[i].properties.NUMREGPUB,
 //    FECHAREGPU: Json.features[i].properties.FECHAREGPU,
 //    NUMESCRITU: Json.features[i].properties.NUMESCRITU,
 //    // No anda
 //    geometry: geometryTransform,
 //   });
 // console.log('TERMINEE');
 //  }
 //
 //    res.status(200).json({
 //     message: 'Parcelas creadas correctamente',
 //     parcelas: createdParcelas,
 //    });
 //   } catch (error) {
 //    console.error('Error al crear parcelas:', error);
 //    res.status(500).json({ error: 'Error al crear parcelas' });
 //   }
 //  };
 //  resultadoDb();
 //  const resultado = resultadoScraping;
 //  .concat(resultadoDb);
}

module.exports = { mapper, fillDb };
