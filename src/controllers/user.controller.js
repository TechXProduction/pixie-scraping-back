const { User, Vivienda, Contador, Intercepto } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const authConfig = require('../middlewares/config/authConfig');
const nodemailer = require('nodemailer');
const { spawn } = require('child_process');
const { changePasswordNotification } = require('../utils/notifications');
const {
 HOST_EMAIL,
 PORT_EMAIL,
 EMAIL,
 EMAIL_PASS,
 DB_HOST,
 DB_PORT,
 CLIENT_PORT,
 REACT_APP_HOST,
} = process.env;

// User Controllers

const userSignIn = async (req, res, next) => {
 // Verificar si req.body es null o undefined
 if (req.body === null || req.body === undefined) {
  res.status(400).send({ message: 'Invalid request body' });
  return;
 }

 // Obtener los datos del cuerpo de la solicitud
 const { username, email, password } = req.body;

 // Verificar si los campos requeridos están presentes
 if (!username || !email || !password) {
  res.status(400).send({ message: 'Missing required fields' });
  return;
 }

 let passwordCryp = bcrypt.hashSync(
  password,
  Number.parseInt(authConfig.rounds),
 );

 try {
  const usernameCreate = await User.findOne({
   where: { username: username },
  });
  const emailCreate = await User.findOne({ where: { email: email } });

  if (usernameCreate) {
   res.status(400).send({ message: 'El nombre de usuario ya esta en uso' });
  } else if (emailCreate) {
   res.status(400).send({ message: 'Email en uso, por favor elige otro' });
  } else if (!usernameCreate && !emailCreate) {
   User.create({
    username: username,
    email: email,
    password: passwordCryp,
   }).then((user) => sendConfirmationEmail(user));
   res.send({
    message:
     'Usuario creado correctamente, cuando un administrador te acepte podras iniciar sesion',
   });
  }
 } catch (err) {
  res.status(400).send(err);
  console.log('Password:', password);
  console.log('Rounds:', authConfig.rounds);
 }
};

const userLogIn = async (req, res) => {
 try {
  let { email, password } = req.body;
  let user = await User.findOne({
   where: {
    email: email,
   },
  });
  // console.log(user)
  if (!user) {
   throw new Error('Usuario y/o contraseña incorrectos!');
  } else {
   if (user.banned || !user.emailVerified) {
    throw new Error(
     'No estas autorizado, deberas esperar a que un administrador te habilite',
    );
   } else {
    if (bcrypt.compareSync(password, user.password)) {
     let token = jwt.sign({ user: user }, authConfig.secret, {
      expiresIn: authConfig.expires,
     });
     user.update({ logged: true });
     // console.log('1',user.logged)
     setTimeout(function () {
      user.update({ logged: false });
     }, 5000); // a los 5 minutos se pone el status del logged en false
     // console.log('user y token', user, token)

     res.status(200).json({
      user: user.dataValues,
      token: token,
     });
    } else {
     throw new Error('Email o contraseña incorrecto!');
    }
   }
  }
 } catch (error) {
  console.log(error);
  res.status(400).json({
   error: error.message,
  });
 }
};

const userLogOut = async (user, token) => {
 try {
  const actualUser = await User.findByPk(user.id);
  if (!actualUser) {
   throw new Error('user not found');
  } else {
   const newToken = jwt.sign({ user: actualUser }, authConfig.secret, {
    expiresIn: 30,
   });
   if (actualUser.logged) {
    setTimeout(function () {
     actualUser.update({ logged: false });
    }, 10000);
   }
   return {
    user: actualUser.dataValues,
    token: newToken,
   };
  }
 } catch (error) {
  console.log(error);
 }
};

const protected = async (req, res) => {
 try {
  const user = req.user; // Acceder a los datos del usuario obtenidos en el middleware
  // Realizar acciones con los datos del usuario aquí
  res.json({ user, msg: 'Acceso autorizado' });
 } catch (error) {
  // Ocurrió un error, enviar respuesta de error
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const allUsers = async (req, res) => {
 try {
  const users = await User.findAll({ where: { banned: false } });
  res.json({ users });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const notification = async (req, res) => {
 try {
  const users = await User.findAll({ where: { emailVerified: false } });
  res.json({ users });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const findVivienda = async (req, res) => {
 try {
  const viviendas = await Vivienda.findAll({
   order: [['createdAt', 'DESC']], // Trae las ultimas 10 viviendas
  });
  res.json({ viviendas });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const contador = async (req, res) => {
 try {
  const contador = await Contador.findByPk(1);
  res.json({ contador });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const intercepto = async (req, res) => {
 try {
  const intercepto = await Intercepto.findAll({
   limit: 1,
   order: [['createdAt', 'DESC']], // Trae el ultimo intercepto
  });
  res.json({ intercepto });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

// send Email confirmation
const sendConfirmationEmail = async (user) => {
 let transporter = nodemailer.createTransport({
  host: `${HOST_EMAIL}`,
  port: `${PORT_EMAIL}`,
  secure: false,
  auth: {
   user: `${EMAIL}`,
   pass: `${EMAIL_PASS}`,
  },
 });
 var token = jwt.sign({ email: user.email }, authConfig.secret);
 //const urlConfirm = `http://${REACT_APP_HOST}/confirm-account/${token}`;

 return transporter
  .sendMail({
   from: 'nutri.u.contact@gmail.com',
   to: user.email,
   subject: 'Cuenta PixieBr Creada Correctamente',
   html: `<p>Su cuenta fue creada correctamente, debera esperar que un administrador acepte su registro para poder iniciar sesion. `,
  })
  .then(() => user);
};

const sendConfirmationEmail2 = (user) => {
 let transporter = nodemailer.createTransport({
  host: `${HOST_EMAIL}`,
  port: `${PORT_EMAIL}`,
  secure: false,
  auth: {
   user: `${EMAIL}`,
   pass: `${EMAIL_PASS}`,
  },
 });
 var token = jwt.sign({ email: user.email }, authConfig.secret);
 //const urlConfirm = `http://${REACT_APP_HOST}/confirm-account/${token}`;

 if (user.emailVerified) {
  return transporter.sendMail({
   from: 'nutri.u.contact@gmail.com',
   to: user.email,
   subject: 'Su cuenta fue habilitada por un administrador',
   html: `<p>Ya puedes iniciar sesion en Pixie Bienes Raices. `,
  });
 } else {
  return transporter.sendMail({
   from: 'nutri.u.contact@gmail.com',
   to: user.email,
   subject:
    'Su cuenta fue inhabilitada por un administrador, contactate si crees que es un error',
   html: `<p>Contacta con un administrador. `,
  });
 }
};

const sendConfirmationScrape = (user) => {
 let transporter = nodemailer.createTransport({
  host: `${HOST_EMAIL}`,
  port: `${PORT_EMAIL}`,
  secure: false,
  auth: {
   user: `${EMAIL}`,
   pass: `${EMAIL_PASS}`,
  },
 });
 var token = jwt.sign({ email: user.email }, authConfig.secret);
 //const urlConfirm = `http://${REACT_APP_HOST}/confirm-account/${token}`;

 if (user.scrapeAuth) {
  return transporter.sendMail({
   from: 'nutri.u.contact@gmail.com',
   to: user.email,
   subject: 'Su cuenta fue habilitada para utilizar el scrape.',
   html: `<p>Ya puedes iniciar sesion en Pixie Bienes Raices y scrapear usuarios. `,
  });
 } else {
  return transporter.sendMail({
   from: 'nutri.u.contact@gmail.com',
   to: user.email,
   subject: 'Su cuenta fue inhabilitada para scrapear.',
   html: `<p>Su cuenta fue inhabilitada para scrapear usuarios, contactate a un administrador si crees que fue un error.`,
  });
 }
};

const sendConfirmationAppraisal = (user) => {
 let transporter = nodemailer.createTransport({
  host: `${HOST_EMAIL}`,
  port: `${PORT_EMAIL}`,
  secure: false,
  auth: {
   user: `${EMAIL}`,
   pass: `${EMAIL_PASS}`,
  },
 });
 var token = jwt.sign({ email: user.email }, authConfig.secret);
 //const urlConfirm = `http://${REACT_APP_HOST}/confirm-account/${token}`;

 if (user.appraisalAuth) {
  return transporter.sendMail({
   from: 'nutri.u.contact@gmail.com',
   to: user.email,
   subject: 'Su cuenta fue habilitada para utilizar el tasador.',
   html: `<p>Ya puedes iniciar sesion en Pixie Bienes Raices y realizar tasaciones.`,
  });
 } else {
  return transporter.sendMail({
   from: 'nutri.u.contact@gmail.com',
   to: user.email,
   subject: 'Su cuenta fue inhabilitada para utilizar el tasador.',
   html: `<p>Su cuenta fue inhabilitada para utilizar el tasador, contactate a un administrador si crees que fue un error.`,
  });
 }
};

const confirmAccount = async (req, res) => {
 try {
  const { id } = req.body;

  // Buscar el usuario por ID en la base de datos
  const user = await User.findOne({ where: { id } });

  if (!user) {
   return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  user.emailVerified = !user.emailVerified;
  await user.save();
  sendConfirmationEmail2(user);
  //await user.save().then((user) => sendConfirmationEmail2(user))

  res.json({ message: 'Cuenta confirmada exitosamente' });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const banUser = async (req, res) => {
 try {
  const { id } = req.body;

  // Buscar el usuario por ID en la base de datos
  const user = await User.findOne({ where: { id } });

  if (!user) {
   return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  user.banned = true;
  user.emailVerified = true;
  await user.save();

  res.json({ message: 'Cuenta Baneada' });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const entrada = async (req, res) => {
 // calcularCoeficientes()
 // res.sendStatus(200)
 const pythonScript = spawn('python', ['./src/python/script2.py']);
 let coeficientes = {};

 const contadorId = 1; // ID del contador que deseas verificar
 const contadorObj = await Contador.findByPk(contadorId);

 pythonScript.stdout.on('data', (data) => {
  const resultado = data.toString();
  const lineas = resultado.split('\r\n');

  for (let i = 0; i < lineas.length; i++) {
   const linea = lineas[i];

   if (linea.startsWith('Variable:')) {
    const variable = linea.match(/Variable: (.+), Coeficiente: (.+)/);

    if (variable && variable.length === 3) {
     const variableNombre = variable[1];
     const variableCoeficiente = variable[2];
     coeficientes[variableNombre] = parseFloat(variableCoeficiente);
    }
   }
  }

  console.log(coeficientes);
 });

 // Capturar los errores del script de Python
 pythonScript.on('error', (err) => {
  console.error(err);
  res
   .status(500)
   .json({ error: 'Error en el cálculo del precio', body: req.body });
 });

 // Cuando el script de Python termina de ejecutarse
 pythonScript.on('close', (code) => {
  if (code === 0) {
   Intercepto.create(coeficientes)
    .then(() => {
     contadorObj.update({ numero: 0 }).then(() => {
      // cuando hace el get, el contador vuelve a 0
      res.json(coeficientes);
     });
    })

    .catch((error) => {
     console.error(error);
     res.status(500).json({
      error: 'Error al guardar los coeficientes en la base de datos',
      body: req.body,
     });
    });
  } else {
   res
    .status(500)
    .json({ error: 'Error en el cálculo del precio', body: req.body });
  }
 });
};

const newVivienda = async (req, res) => {
 try {
  const { error } = Vivienda.build(req.body).validate();
  if (error) {
   res.status(400).json({ error: error.message });
   return;
  }
  const nuevaVivienda = await Vivienda.create(req.body);
  const contadorId = 1; // ID del contador que deseas verificar
  const contadorObj = await Contador.findByPk(contadorId);

  if (contadorObj) {
   let contadorValor = contadorObj.numero;
   // Verificar si el contador es menor que 5
   if (contadorValor < 5) {
    contadorValor += 1;
    console.log('El contador es menor que 5');
   } else {
    contadorValor = 5;
    console.log('El contador ha vuelto a 5');
    //await axios.get("http://localhost:5001/user/entrada") // se ejecuta el script de python
   }
   // Actualizar el valor del contador en la base de datos
   await contadorObj.update({ numero: contadorValor });
  } else {
   console.log('No se encontró el contador con el ID especificado');
  }
  res.status(201).json({ nuevaVivienda, contadorObj });

  // Obtener las últimas 10 viviendas
  const ultimasViviendas = await Vivienda.findAll({
   order: [['createdAt', 'DESC']],
  });
  // Convertir las viviendas en formato CSV
  const csvData = ultimasViviendas
   .map(
    (vivienda) =>
     `${vivienda.Domicilio},${vivienda.M2},${vivienda.M2_Construccion},${vivienda.Ubicacion},${vivienda.COS},${vivienda.CUS},${vivienda.Seguridad},${vivienda.Edad},${vivienda.No_Cuartos},${vivienda.No_banos},${vivienda.Dos_Plantas},${vivienda.M2_Cochera},${vivienda.minisplit_2ton},${vivienda.minisplit_1_5ton},${vivienda.minisplit_1ton},${vivienda.No_recamaras},${vivienda.Nivel_Socioeconomico},${vivienda.Opinion_Valor_Precio_Final}`,
   )
   .join('\n');
  // Obtener el encabezado del CSV
  const csvHeader =
   'Domicilio,M2,M2_Construccion,Ubicacion,COS,CUS,Seguridad,Edad,No_Cuartos,No_banos,Dos_Plantas,M2_Cochera,minisplit_2ton,minisplit_1_5ton,minisplit_1ton,No_recamaras,Nivel_Socioeconomico,Opinion_Valor_Precio_Final';
  // Guardar el CSV en un archivo
  fs.writeFile('ultimas_viviendas.csv', `${csvHeader}\n${csvData}`, (err) => {
   if (err) {
    console.error('Error al guardar el archivo CSV:', err);
   } else {
    console.log('Archivo CSV guardado correctamente.');
   }
  });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor', data: error });
 }
};

const deleteVivienda = async (req, res) => {
 const { id } = req.body;
 console.log(id);
 try {
  const chauvivienda = await Vivienda.findByPk(id);
  if (!chauvivienda) {
   return res.status(404).json({ error: 'Vivienda no existe' });
  }
  chauvivienda.destroy();
  return res.json({ message: 'Vivienda eliminada correctamente' });
 } catch (error) {
  return res.status(500).json({ error: 'Error en el servidor', data: error });
 }
};

const probando = async (req, res) => {
 try {
  const jsonFile = path.join(__dirname, '../utils/datos.json');
  const jsonData = fs.readFileSync(jsonFile, 'utf8');
  const json = JSON.parse(jsonData);

  const nuevasViviendas = await Vivienda.bulkCreate(json);
  res.status(201).json(nuevasViviendas);
 } catch (error) {
  console.log(error.message);
  res.status(500).json({ error: 'Error en el servidor', data: error });
 }
};

const confirmToken = async (req, res) => {
 // confirmar cuenta controller
 try {
  confirmAccount2(req.params.token)
   .then(() => {
    res
     .status(200)
     .send({ succes: true, message: 'user confirmed succesfully' });
   })
   .catch((err) =>
    res.status(400).send({ succes: false, message: err.message }),
   );
 } catch (err) {
  console.log(err);
 }
};

async function confirmAccount2(token) {
 var email = null;
 try {
  const payload = jwt.verify(token, authConfig.secret);
  email = payload.email;
 } catch (err) {
  throw new Error('Ups!, token is invalid');
 }

 User.update(
  { emailVerified: true },
  {
   where: {
    email: email,
   },
  },
 );
}

const forgotPassword = async (req, res) => {
 const { email } = req.body;
 try {
  if (!email) {
   res.send({ message: 'Insert email' });
  } else if (email) {
   const oldUser = await User.findOne({ where: { email: email } });

   if (!oldUser) {
    res.status(400).send({ message: 'Email no exist' });
   } else if (oldUser) {
    var token = jwt.sign({ email: oldUser.email }, authConfig.secret, {
     expiresIn: '5m',
    });
    changePasswordNotification(email, token);
    res.send({
     message:
      'An email to recover password was sent successfully, check your email',
    });
   }
  }
 } catch (error) {
  console.log(error);
 }
};

const newPassword = async (req, res) => {
 let { token } = req.params;
 let { password } = req.body;

 let passwordCryp = bcrypt.hashSync(
  password,
  Number.parseInt(authConfig.rounds),
 );

 try {
  const payload = jwt.verify(token, authConfig.secret);
  let email = payload.email;
  User.update(
   { password: passwordCryp },
   {
    where: {
     email: email,
    },
   },
  );

  res.send({ message: 'Your password was successfully modified' });
 } catch (error) {
  res
   .status(400)
   .send({ message: 'Your session expired, or token is invalid' });
 }
};

const scrapeAuth = async (req, res) => {
 try {
  const { id } = req.body;

  // Buscar el usuario por ID en la base de datos
  const user = await User.findOne({ where: { id } });

  if (!user) {
   return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (user.scrapeAuth) user.scrapeAuth = false;
  else user.scrapeAuth = true;

  user.emailVerified = true;
  await user.save();
  sendConfirmationScrape(user);

  res.json({ message: 'Cuenta habilitada para el scrape' });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

const appraisalAuth = async (req, res) => {
 try {
  const { id } = req.body;

  // Buscar el usuario por ID en la base de datos
  const user = await User.findOne({ where: { id } });

  if (!user) {
   return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (user.appraisalAuth) user.appraisalAuth = false;
  else user.appraisalAuth = true;

  user.emailVerified = true;
  await user.save();
  sendConfirmationAppraisal(user);

  res.json({ message: 'Cuenta habilitada para el scrape' });
 } catch (error) {
  res.status(500).json({ error: 'Error en el servidor' });
 }
};

module.exports = {
 userSignIn,
 userLogIn,
 userLogOut,
 confirmAccount,
 forgotPassword,
 newPassword,
 sendConfirmationEmail2,
 protected,
 allUsers,
 notification,
 findVivienda,
 contador,
 intercepto,
 banUser,
 entrada,
 newVivienda,
 deleteVivienda,
 probando,
 confirmToken,
 scrapeAuth,
 appraisalAuth,
};
