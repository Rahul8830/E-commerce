const express = require("express");
const path = require('path');
const routes = express.Router();
const { body } = require("express-validator/check");

const adminController = require('../controller/admin');
const isAuth = require("../middleware/is-auth");

routes.get("/add-product", isAuth, adminController.getAddProduct);

routes.post("/add-product",
    [
        body("title")
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body("imageUrl")
            .isURL(),
        body("price")
            .isFloat(),
        body("description")
            .isLength({ min: 5, max: 400 })
            .trim()
    ],
    isAuth, adminController.postAddProduct);

routes.get("/products", isAuth, adminController.getProducts);

routes.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

routes.post("/edit-product/:productId",
    [
        body("title")
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body("imageUrl")
            .isURL(),
        body("price")
            .isFloat(),
        body("description")
            .isLength({ min: 5, max: 400 })
            .trim()
    ], isAuth, adminController.postEditProduct);

routes.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = routes;