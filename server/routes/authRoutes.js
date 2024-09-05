const routes = require("express").Router();
const authController = require("../controllers/authController");

routes.post("/signup", authController.signupController);
routes.post("/login", authController.loginController);
routes.get("/refresh", authController.refreshAccessTokenController);

module.exports = routes;
