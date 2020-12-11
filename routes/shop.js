const express = require("express");
const shopController = require('../controller/shop');
const isAuth = require("../middleware/is-auth");
const routes = express.Router();

routes.get("/", shopController.getIndex);
routes.get("/products", shopController.getProducts);
routes.get("/products/:productId", shopController.getDetails);

routes.get("/cart",isAuth , shopController.getCart);
routes.post("/add-to-cart/:productId",isAuth , shopController.addToCart);
routes.post("/cart-delete-item",isAuth ,shopController.deleteCartItem);

routes.get("/orders",isAuth , shopController.getOrders);
routes.post("/create-order",isAuth , shopController.postOrder);
routes.get("/orders/:orderId",isAuth , shopController.getInvoice);

module.exports = routes;