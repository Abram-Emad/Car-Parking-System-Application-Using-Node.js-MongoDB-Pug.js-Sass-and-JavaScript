const router = require("express").Router();
const authGuard = require("../guards/auth.guard");
const bodyParser = require("body-parser");
const profileController = require("../controllers/userProfile.controller");
const userModel = require("../models/user.model");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/profileImageButton', authGuard.isAuth, profileController.upload, profileController.postProfileImage);

router.post('/profileCoverButton', authGuard.isAuth, profileController.upload, profileController.postProfileCover);

router.post('/editUser', authGuard.isAuth, profileController.postEditUser);

router.get('/deleteAccount', authGuard.isAuth, profileController.getDdeleteAccount);

router.post('/sendDeleteAccountOTP', authGuard.isAuth, profileController.sendDeleteAccountOTP);

router.post('/deleteAccount', authGuard.isAuth, profileController.deleteUser);

router.get('/changePassword', authGuard.isAuth, profileController.getChangePassword);

router.post('/sendChangePasswordOTP', authGuard.isAuth, profileController.sendChangePasswordOTP);

router.post('/changePassword', authGuard.isAuth, profileController.changePassword);

router.post('/darkMode', authGuard.isAuth, userModel.postDarkMode);

module.exports = router;
