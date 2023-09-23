/*  const puppeteer = require('puppeteer'); 

const HacerBusqueda = async (
 juzgado,
 titular,
 numeroExpediente,
 anio,
 check,
) => {
 try {
   const browser = await puppeteer.launch({
   headless: 'new',
   args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox'],
  });
 
   const page = await browser.newPage(); 

  switch (check) {
   case 1:
    // No se proporciona año ni número de expediente
    await busquedaSinParams();
    break;
   case 2:
    // Se proporciona solo el año
    await busquedaConAño();
    break;
   case 3:
    // Se proporciona solo el número de expediente
    await busquedaConExp();
    break;
   case 4:
    // Se proporcionan todos los parámetros
    await busquedaConParams();
    break;
  }

  async function busquedaConParams() {
   await navegarYPersistirDatos(page, juzgado, titular, numeroExpediente, anio);
  }

  async function busquedaConExp() {
   for (let i = 0; i < anio.length; i++) {
    const anioActual = anio[i];
    await navegarYPersistirDatos(
     page,
     juzgado,
     titular,
     numeroExpediente,
     anioActual,
    );
   }
  }

  async function busquedaConAño() {
   await navegarYPersistirDatos(page, juzgado, titular, numeroExpediente, anio);
  }

  async function busquedaSinParams() {
   await navegarYPersistirDatos(page, juzgado, titular, numeroExpediente, anio);
  }

  const resultados = await extraerDatos(page);
  const mergedResults = mapResponse(
   resultados,
   numeroExpediente,
   anio,
   titular,
  );

  await page.close();

  return mergedResults;
 } catch (error) {
  console.error('Error:', error);
  return false;
 }
};

async function navegarYPersistirDatos(
 page,
 juzgado,
 titular,
 numeroExpediente,
 año,
) {
 try {
  await page.setRequestInterception(true);
  page.on('request', (request) => {
   if (
    request.resourceType() === 'image' ||
    request.resourceType() === 'stylesheet' ||
    request.resourceType() === 'font'
   ) {
    request.abort();
   } else {
    request.continue();
   }
  });

  await page.setCacheEnabled(true);
  page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://stjsonora.gob.mx/ListaAcuerdos/', {
   waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('#select2-IdUnidad-container');
  await page.click('#select2-IdUnidad-container');
  await page.waitForSelector('.select2-results__option');

  const opciones = await page.$$('.select2-results__option');
  for (const opcion of opciones) {
   const textoOpcion = await page.evaluate((el) => el.textContent, opcion);
   if (textoOpcion.includes(juzgado)) {
    await opcion.click();
    break;
   }
  }

  await page.select('#Tipo', '2'); // No cambiar
  await page.type('#Asunto', numeroExpediente);
  await page.type('#Anio', año);
  await page.click('.boton.btnBuscar');
  await page.waitForSelector('#container');
  //   await page.screenshot({ path: `captura_${juzgado}.png` });
  const data = await extraerDatos(page);
  // console.log('EEAAAAAA');
  const mappedResults = mapResponse(data, numeroExpediente, año, titular);

  return mappedResults;
 } catch (err) {
  console.log(err.message);
  await page.close();
  return false;
 }
}

async function extraerDatos(page) {
 const tableData = await page.evaluate(() => {
  const rows = Array.from(document.querySelectorAll('tr'));
  const data = rows.map((row) => {
   const cells = Array.from(row.querySelectorAll('td'));
   return cells.map((cell) => cell.innerText);
  });
  return data;
 });
 return tableData;
}

function mapResponse(data, numeroExpediente, anio, nombre) {
 let response = [];
 for (let i = 0; i < data.length; i++) {
  let d = data[i];
  if (d.length > 0 && d[2] != undefined && d[3] != undefined) {
   //    console.log('d[2]!!', d[2]);
   //    console.log('d[3]!!', d[3]);
   if (d[2].includes(numeroExpediente + '/' + anio)) {
    if (eval(buildValidationName(nombre))) {
     console.log('validacion de nombre', eval(buildValidationName(nombre)));
     let res = {
      año: d[0],
      secretaria: d[1],
      asunto: d[2],
      partes: d[3],
      sistesisResultado: d[4],
     };
     response.push(res);
    }
   }
  }
 }
 //  console.log('respuesta', response);
 if (response.length !== 0) {
  // console.log('respuesta', response);
  return response;
 }
}

function buildValidationName(nombre) {
 // Convertir el nombre a mayúsculas y reemplazar múltiples espacios por un solo espacio
 nombre = nombre.toUpperCase().replace(/\s+/g, ' ');

 // Dividir el nombre en partes individuales
 let partes = nombre.split(' ');

 // Variable para almacenar el código de validación
 let code = '';

 // Variable para contar las partes del nombre que coinciden
 let count = 0;

 // Recorrer cada parte del nombre
 for (let i = 0; i < partes.length; i++) {
  const e = partes[i];

  // Agregar la comprobación de si la parte del nombre está incluida en d[3]
  code += `d[3].includes("${e}")`;

  // Incrementar el contador de coincidencias
  count++;

  // Si el contador es mayor o igual a 2 y no es el último elemento, agregar "||" al código
  if (count >= 2 && i < partes.length - 1) {
   code += ' || ';
  }
 }

 // Devolver el código de validación generado
 return code;
}

module.exports = HacerBusqueda;
 */