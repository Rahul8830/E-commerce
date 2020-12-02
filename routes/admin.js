const express = require("express");
const path = require('path');
const routes = express.Router();
const adminController = require('../controller/admin');
const isAuth = require("../middleware/is-auth");

routes.get("/add-product",isAuth , adminController.getAddProduct);

routes.post("/add-product",isAuth , adminController.postAddProduct);

routes.get("/products",isAuth , adminController.getProducts);
routes.get("/edit-product/:productId",isAuth , adminController.getEditProduct);
routes.post("/edit-product/:productId",isAuth , adminController.postEditProduct);
routes.post("/delete-product",isAuth , adminController.postDeleteProduct);
module.exports = routes;