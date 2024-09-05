const routes = require("express").Router();
const productController = require("../controllers/productController");

routes.get("/all", productController);

module.exports = routes;
