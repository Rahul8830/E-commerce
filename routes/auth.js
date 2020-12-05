const express = require('express');
const routes = express.Router();
const { check, body } = require("express-validator/check");
const User = require("../model/user");

const authController = require('../controller/auth');

routes.get("/login", authController.getLogin);

routes.post("/login",
    [
        check('email')
            .isEmail()
            .withMessage("Please enter a valid email id")
            .normalizeEmail(),
        check("password",
            "Enter a password with only text and numbers and at least 5 characters.")
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ], authController.postLogin);

routes.post("/logout", authController.logout);

routes.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage("Please enter a valid email id")
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject("Email already exists.");
                        }
                    })
            })
        ,
        body(
            "password",
            "Enter a password with only text and numbers and at least 5 characters."
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body("confirmPassword").trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
    ], authController.postSignup);

routes.get('/signup', authController.getSignup);

routes.post('/sendReset', authController.sendReset);

routes.get('/reset', authController.getReset);

routes.get('/reset/:token', authController.getNewPassword);

routes.post("/new-password", authController.changePassword);

module.exports = routes;