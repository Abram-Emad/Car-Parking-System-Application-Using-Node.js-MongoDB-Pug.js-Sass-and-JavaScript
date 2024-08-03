const router = require("express").Router();
const bodyParser = require("body-parser");
const authGuard = require("../guards/auth.guard");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/dashboard", authGuard.isAdmin, dashboardController.getDashboard);

router.get("/dashboardError", authGuard.isAdmin, dashboardController.getDashboardError);

router.get("/users", authGuard.isAdmin, dashboardController.getAllUsers);

module.exports = router;