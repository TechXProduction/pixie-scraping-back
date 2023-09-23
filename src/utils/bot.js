/* const puppeteer = require("puppeteer");
const { Acto } = require('../db');

// fijarse situaciones de corte de las func  ya ta
// iteracion cuando no se pasa año checker

const HacerBusqueda = async (
  juzgados,
  titular,
  numeroExpediente,
  año,
  check
) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    });

    const NUM_PESTAÑAS = 1; // Número de pestañas en paralelo
    const pestañas = await Promise.all(
      Array.from({ length: NUM_PESTAÑAS }).map(() => browser.newPage())
    );

    const promises = [];

    switch (check) {
      case 1:
        // No le llega año ni n° de exp
        busquedaSinParams();
        break;
      case 2:
        // Le llega solo año
        busquedaConAño();
        break;
      case 3:
        // Le llega solo n° exp
        // console.log('anda');
        // browser.close();
        busquedaConExp();
        break;
      case 4:
        // Le llega todos los params
        busquedaConParams();
        break;
    }

    async function busquedaConParams() {
      for (let i = 0; i < pestañas.length; i++) {
        const juzgado = juzgados[i % juzgados.length];
        const pestaña = pestañas[i];
        const exp = numeroExpediente;
        for (let i = 0; i < exp.length; i++) {
          promises.push(
            navegarYPersistirDatos(pestaña, juzgado, titular, exp[i], año)
          );
        }
      }
    }

    async function busquedaConExp() {
      for (let i = 0; i < pestañas.length; i++) {
        const anio = año[i % año.length];
        const pestaña = pestañas[i];

        promises.push(
          navegarYPersistirDatos(
            pestaña,
            juzgados,
            titular,
            numeroExpediente,
            anio
          )
        );
      }
    }

    async function busquedaConAño() {
      for (let i = 0; i < pestañas.length; i++) {
        const pestaña = pestañas[i];
        console.log({ "n° exp": numeroExpediente, año });
        promises.push(
          navegarYPersistirDatos(
            pestaña,
            juzgados,
            titular,
            numeroExpediente,
            año
          )
        );
      }
    }
    async function busquedaSinParams() {
      for (let i = 0; i < pestañas.length; i++) {
        const pestaña = pestañas[i];
        console.log("n° exp:", numeroExpediente);
        promises.push(
          navegarYPersistirDatos(
            pestaña,
            juzgados,
            titular,
            numeroExpediente,
            año
          )
        );
      }
    }

    const resultados = await Promise.all(promises);
    // console.log('y esto???', resultados);

    //   await Promise.all(pestañas.map((pestaña) => pestaña.close()));
    await browser.close();

    // Combinar los resultados de todas las pestañas y retornarlos
    const mergedResults = resultados.flat();

    return mergedResults;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

async function navegarYPersistirDatos(
  page,
  juzgado,
  titular,
  numeroExpediente,
  año
) {
  try {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setCacheEnabled(true);
    page.setViewport({ width: 1280, height: 720 });
    await page.goto(`https://stjsonora.gob.mx/ListaAcuerdos/?IdUnidad=153&Tipo=2&Asunto=${numeroExpediente}&Anio=2021`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#select2-IdUnidad-container");
    const opciones = await page.$$(".select2-results__option");
    for (const opcion of opciones) {
      const textoOpcion = await page.evaluate((el) => el.textContent, opcion);
      if (textoOpcion.includes(juzgado)) {
        await opcion.click();
        break;
      }
    } 

    await page.select("#Tipo", "2");
    await page.type("#Asunto", numeroExpediente);
    await page.type("#Anio", año); 
    await page.click(".boton.btnBuscar");
    await page.waitForSelector("#container");
    //   await page.screenshot({ path: `captura_${juzgado}.png` });
    const data = await extraerDatos(page);
    const mappedResults = mapResponse(data);
    data.map(async(dataInser) => {
      if(dataInser.length > 0){
        await Acto.create({ secretaria: dataInser[1], asunto: dataInser[2], partes: dataInser[3], sintesis: dataInser[4], fecha: dataInser[0]});
      }
    }) 
    await Acto.create({ secretaria: dataInser[1], asunto: dataInser[2], partes: dataInser[3], sintesis: dataInser[4], fecha: dataInser[0]}); 
    

    return mappedResults;
  } finally {
    await page.close();
    // No cerramos la página aquí para reutilizarla en la siguiente iteración
  }
}

async function extraerDatos(page) {
  const tableData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("tr"));
    const data = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td"));
      return cells.map((cell) => cell.innerText);
    });
    return data;
  });
  return tableData;
}

async function mapResponse(data) {
  for (let i = 0; i < data.length; i++) {
    let d = data[i];
    if (d.length > 0 && d[2] != undefined && d[3] != undefined) {
          let res = {
            fecha: d[0],
            secretaria: d[1],
            asunto: d[2],
            partes: d[3],
            sintesis: d[4],
          };
          await Acto.create(res);
        }
      }
    
  
 
}

function buildValidationName(nombre) {
  // Convertir el nombre a mayúsculas y reemplazar múltiples espacios por un solo espacio
  nombre = nombre.toUpperCase().replace(/\s+/g, " ");

  // Dividir el nombre en partes individuales
  nombre = nombre.split(" ");

  // Variable para almacenar el código de validación
  let code = ``;

  // Recorrer cada parte del nombre
  for (let i = 0; i < nombre.length; i++) {
    const e = nombre[i];

    // Si el código no está vacío y no es el último elemento del nombre, agregar "||" al código
    if (code != "" && i != nombre.length) {
      code += ` ||`;
    }

    // Agregar la comprobación de si la parte del nombre está incluida en d[3]
    code += ` d[3].includes(`;
    code += `"${e}"`;
    code += `)`;
  }

  // Devolver el código de validación generado
  console.log(code, "Esto es codeee")
  return code;
}

module.exports = HacerBusqueda;
 */