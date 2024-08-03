const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const garageController = require('../controllers/addGarage.controller');
const garagesController = require('../controllers/garages.controller');
const authGuard = require("../guards/auth.guard");

router.use(bodyParser.json());

router.get('/addGarage', authGuard.isAdmin, garageController.getAllGarages);
router.post('/Garages', bodyParser.urlencoded({ extended: true }), garagesController.postOccupancyValues);

router.get('/add', authGuard.isAdmin, garageController.getAddGarage);
router.post('/add', authGuard.isAdmin, bodyParser.urlencoded({ extended: true }), garageController.postGarage);

router.post('/edit/:id', authGuard.isAdmin, bodyParser.urlencoded({ extended: true }), garageController.postEdit);

router.post('/delete/:id', authGuard.isAdmin, garageController.deleteGarage);

module.exports = router;