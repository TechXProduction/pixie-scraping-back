const { Router } = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const { isUserLoggedIn, isUserLoggedInAdmin } = require('../middlewares/auth');

const calcularCoeficientes = require('../utils/calcularCoeficientes.js');
const { User, Vivienda, Intercepto, Contador } = require('../db');
const {
 userLogIn,
 userSignIn,
 confirmAccount,
 userLogOut,
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
} = require('../controllers/user.controller');

const router = Router();

// User Routes

router.post('/signin', userSignIn);

router.post('/login', userLogIn);

router.get('/protected', isUserLoggedIn, protected);

router.get('/users', isUserLoggedInAdmin, allUsers);

router.get('/notification', isUserLoggedInAdmin, notification);

router.post('/confirmAccount', isUserLoggedIn, confirmAccount);

router.post('/banear', isUserLoggedIn, banUser);

router.post('/scrapeAuth', isUserLoggedIn, scrapeAuth);

router.post('/appraisalAuth', isUserLoggedIn, appraisalAuth);

router.get('/confirm/:token', confirmToken);

router.post('/forgotPassword', forgotPassword);

router.post('/newPassword/:token', newPassword);

///////////////////////////////////////////////

// Insertar en appraisal Routes

router.get('/viviendas', findVivienda);

router.get('/contador', contador);

router.get('/intercepto', intercepto);

router.get('/entrada', entrada);

router.post('/newVivienda', newVivienda);

router.delete('/deleteVivienda', deleteVivienda);

// ruta para subir JSON con las primeras viviendas creada por Mario.

router.post('/probando', probando);

module.exports = router;
