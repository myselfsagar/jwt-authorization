const routes = require("express").Router();
const validateUser = require("../middlewares/validateUser");
const authRoutes = require("../routes/authRoutes");
const productRoutes = require("../routes/productRoutes");

routes.use("/auth", authRoutes);
routes.use("/products", validateUser, productRoutes);

module.exports = routes;
