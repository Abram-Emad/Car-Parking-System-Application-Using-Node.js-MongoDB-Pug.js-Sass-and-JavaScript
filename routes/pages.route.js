const router = require("express").Router();
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const authGuard = require("../guards/auth.guard");
const pagesController = require("../controllers/pages.controller");
const contactUsController = require("../controllers/contactUs.controller");
const garagesController = require("../controllers/garages.controller");

router.get('/Garages', authGuard.isUserAndNotAuth, garagesController.getAllGarages);

router.get("/Contact-Us", authGuard.isUserAndNotAuth, contactUsController.getContactUs);

router.post("/Contact-Us", authGuard.isUserAndNotAuth, bodyParser.urlencoded({ extended: true }), contactUsController.postContactUs);

router.get("/Team-Members", authGuard.isUserAndNotAuth, pagesController.getTeamMembers);

router.get("/privacyDataPolicy", authGuard.isUserAndNotAuth, pagesController.getPrivacyDataPolicy);

module.exports = router;