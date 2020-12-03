const express = require('express');
const routes = express.Router();
const authController = require('../controller/auth');

routes.get("/login",authController.getLogin);
routes.post("/login",authController.postLogin);
routes.post("/logout",authController.logout);
routes.post('/signup', authController.postSignup);
routes.get('/signup', authController.getSignup);
routes.post('/sendReset', authController.sendReset);
routes.get('/reset', authController.getReset);
routes.get('/reset/:token', authController.getNewPassword);
routes.post("/new-password", authController.changePassword);

module.exports = routes;