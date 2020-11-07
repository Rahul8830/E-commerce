const express = require("express");
const path = require('path');
const routes = express.Router();
const adminController = require('../controller/admin');

routes.post("/add-product", adminController.postAddProduct);
routes.get("/products", adminController.getProducts);
routes.get("/add-product", adminController.getAddProduct);
routes.get("/edit-product/:productId", adminController.getEditProduct);
routes.post("/edit-product/:productId", adminController.postEditProduct);
routes.post("/delete-product", adminController.postDeleteProduct);
module.exports = routes;