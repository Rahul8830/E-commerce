const express = require('express');
const routes = express.Router();
const authController = require('../controller/auth');

routes.get("/login",authController.getLogin);
routes.post("/login",authController.postLogin);
routes.post("/logout",authController.logout);
routes.post('/signup', authController.postSignup);
routes.get('/signup', authController.getSignup);

module.exports = routes;