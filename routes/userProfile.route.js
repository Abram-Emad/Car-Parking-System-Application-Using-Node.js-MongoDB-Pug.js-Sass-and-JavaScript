const router = require("express").Router();
const authGuard = require("../guards/auth.guard");
const bodyParser = require("body-parser");
const profileController = require("../controllers/userProfile.controller");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", authGuard.isAuth, profileController.getOwnProfile);

module.exports = router;