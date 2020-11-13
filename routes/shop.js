const express = require("express");
const shopController = require('../controller/shop');
const routes = express.Router();

routes.get("/", shopController.getIndex);
routes.get("/products/:productId", shopController.getDetails);
routes.get("/products", shopController.getProducts);
routes.get("/cart", shopController.getCart);
routes.get("/orders", shopController.getOrders);
routes.post("/add-to-cart/:productId", shopController.addToCart);
routes.post("/cart-delete-item",shopController.deleteCartItem);
routes.post("/create-order", shopController.postOrder);
module.exports = routes;