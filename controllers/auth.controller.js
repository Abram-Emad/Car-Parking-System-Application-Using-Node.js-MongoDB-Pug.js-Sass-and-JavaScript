const authModel = require("../models/auth.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const saltRounds = 10;
require('dotenv').config();
const adminAccount = process.env.ADMIN_ACCOUNT;
const sendePass = process.env.SENDE_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    syscall: 'spawn sendmail',
    path: 'sendmail',
    newline: 'windows',
    logger: false,
    auth: {
        user: adminAccount,
        pass: sendePass
    }
});

exports.getLoginSignup = (req, res, next) => {
    const isSignup = req.query.action === 'signup';
    const isLogin = req.query.action === 'login';
    if (isSignup) {
        renderSignupPage(req, res);
    } else if (isLogin) {
        renderLoginPage(req, res);
    }
};

function renderSignupPage(req, res) {
    res.render("login-signup", {
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        pageTitle: "Signup",
    });
}

function renderLoginPage(req, res) {
    res.render("login-signup", {
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        pageTitle: "Login"
    });
}

exports.getParkeyLoginSignup = (req, res, next) => {
    const isSignup = req.query.action === 'signup';
    const isLogin = req.query.action === 'login';
    if (isSignup) {
        renderParkeySignupPage(req, res);
    } else if (isLogin) {
        renderParkeyLoginPage(req, res);
    }
};

function renderParkeySignupPage(req, res) {
    res.render("parkyLoginSignup", {
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        pageTitle: "Signup",
    });
}

function renderParkeyLoginPage(req, res) {
    res.render("parkyLoginSignup", {
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        pageTitle: "Login"
    });
}

const admins = [
    {
        name: process.env.ADMIN_1_NAME,
        email: process.env.ADMIN_1_EMAIL,
        password: process.env.ADMIN_1_PASSWORD,
        profileImage: process.env.ADMIN_1_PROFILE_IMAGE
    },
    {
        name: process.env.ADMIN_2_NAME,
        email: process.env.ADMIN_2_EMAIL,
        password: process.env.ADMIN_2_PASSWORD,
        profileImage: process.env.ADMIN_2_PROFILE_IMAGE
    },
    {
        name: process.env.ADMIN_3_NAME,
        email: process.env.ADMIN_3_EMAIL,
        password: process.env.ADMIN_3_PASSWORD,
        profileImage: process.env.ADMIN_3_PROFILE_IMAGE
    },
    {
        name: process.env.ADMIN_4_NAME,
        email: process.env.ADMIN_4_EMAIL,
        password: process.env.ADMIN_4_PASSWORD,
        profileImage: process.env.ADMIN_4_PROFILE_IMAGE
    },
    {
        name: process.env.ADMIN_5_NAME,
        email: process.env.ADMIN_5_EMAIL,
        password: process.env.ADMIN_5_PASSWORD,
        profileImage: process.env.ADMIN_5_PROFILE_IMAGE
    }
];

async function createAdminUsers() {
    for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];
        try {
            const adminExists = await userModel.adminUserExists(admin.email);
            if (!adminExists) {
                await authModel.createNewUserAdmin(admin.name, admin.email, admin.password, admin.profileImage);
                console.log(`Admin ${admin.name} created`);
            } else {
                console.log(`Admin ${admin.name} already created`);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

createAdminUsers();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
}).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

exports.postSignup = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            req.flash("authError", "Failed to upload images");
            res.redirect("/login-signup?action=signup");
        } else {
            const { username, email, password, PaymentCardNumber, PaymentCardExpDate, PaymentCard3thNum } = req.body;
            const otp = crypto.randomInt(1000, 9999).toString();
            const profileImagePath = req.files['profileImage'][0].path;
            const coverImagePath = req.files['coverImage'][0].path;
            const mailOptions = {
                from: adminAccount,
                to: email.toString(),
                subject: 'Confirm Your Email',
                html: `
                <div class='form-container'
                  style='width: max-content;padding: 25px;background-color: white;margin: 0 auto;margin-top: 100px;border: 1px solid #ccc;border-radius: 25px;'>
                      <h1 style='color: #24292f;margin-bottom: 5px;'>Dear ${username}</h2>
                      <h4 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Use the following OTP to confirm your email:</h4>
                      <h2 style='background-color: #24292f;color: white;padding: 11px 15px; width: fit-content;margin: 5px auto 15px auto;border-radius: 15px;'>${otp}</h2>
                      <h5 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Thank you for choosing our service!, Best regards, The Garage App Team</h5>  
                </div>
              `
            };
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    req.flash("authError", "Failed to send email");
                    res.redirect("/login-signup?action=signup");
                } else {
                    console.log('Email sent: ' + info.response);
                    try {
                        await authModel.createNewUser(username, email, password, profileImagePath, coverImagePath, PaymentCardNumber, PaymentCardExpDate, PaymentCard3thNum);
                        await userModel.setConfirmEmailOTP(email, otp);
                        res.redirect("/confirmEmail");
                    } catch (err) {
                        req.flash("authError", err);
                        res.redirect("/login-signup?action=signup");
                    }
                }
            });
        }
    });
};

exports.getConfirmEmail = async (req, res, next) => {
    try {
        res.render("confirmEmail", {
            authError: req.flash("authError")[0],
            validationErrors: req.flash("validationErrors"),
            pageTitle: "Confirm Email",
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};

exports.postConfirmEmail = async (req, res, next) => {
    const { otp } = req.body;
    try {
        const user = await userModel.setConfirmedEmail(otp);

        if (user) {
            return res.redirect("/login-signup?action=login");
        } else {
            throw new Error("Failed to confirm email");
        }
    } catch (err) {
        req.flash("authError", err.message || "Failed to confirm email");
        res.redirect("/confirmEmail");
    }
};

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validationErrors', errors.array());
        return res.redirect('/login-signup?action=login');
    }
    authModel
        .login(req.body.email, req.body.password)
        .then(result => {
            if (result.role === 'user') {
                req.session.userId = String(result.user.id);
                req.session.name = result.user.username;
                req.session.email = result.user.email;
                req.session.profileImage = result.user.profileImage;
                req.session.role = result.role;
                res.status(303).redirect('/');
            } else if (result.role === 'admin') {
                req.session.adminId = String(result.user.id);
                req.session.adminName = result.user.username;
                req.session.adminEmail = result.user.email;
                req.session.adminProfileImage = result.user.profileImage;
                req.session.role = result.role;
                res.status(303).redirect('/dashboard');
            } else {
                throw new Error('Invalid role');
            }
        })
        .catch(err => {
            if (err.message === 'Your email is not confirmed') {
                req.flash('authError', `Your email isn't confirmed.`);
                return res.redirect('/login-signup?action=login');
            } else {
                req.flash('authError', err.message);
                return res.redirect('/login-signup?action=login');
            }
        });
};

exports.postParkeyLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validationErrors', errors.array());
        return res.redirect('/parkyLoginSignup?action=login');
    }
    authModel
        .login(req.body.email, req.body.password)
        .then(result => {
            if (result.role === 'user') {
                req.session.userId = String(result.user.id);
                req.session.name = result.user.username;
                req.session.email = result.user.email;
                req.session.profileImage = result.user.profileImage;
                req.session.role = result.role;
                res.status(303).redirect('https://www.youtube.com/');
            } else if (result.role === 'admin') {
                req.session.adminId = String(result.user.id);
                req.session.adminName = result.user.username;
                req.session.adminEmail = result.user.email;
                req.session.adminProfileImage = result.user.profileImage;
                req.session.role = result.role;
                res.status(303).redirect('/dashboard');
            } else {
                throw new Error('Invalid role');
            }
        })
        .catch(err => {
            if (err.message === 'Your email is not confirmed') {
                req.flash('authError', `Your email isn't confirmed.`);
                return res.redirect('/parkyLoginSignup?action=login');
            } else {
                req.flash('authError', err.message);
                return res.redirect('/parkyLoginSignup?action=login');
            }
        });
};

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};

exports.getSubscriptionPlans = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id);
        res.render("Subscription-plans", {
            pageTitle: "Subscription-plans",
            darkMode: data ? data.darkMode : false,
            SubscriptionPlans: data.SubscriptionPlans,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};

exports.getForgetPasswordEnterOTP = (req, res, next) => {
    const isforget = req.query.action === 'forget';
    const isenterOTP = req.query.action === 'enterOTP';
    if (isforget) {
        renderForgetPassword(req, res);
    } else if (isenterOTP) {
        renderEnterOTP(req, res);
    }
};

function renderForgetPassword(req, res) {
    res.render("forgetPassword-enterOTP", {
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        pageTitle: "Forget Password",
    });
}

function renderEnterOTP(req, res) {
    res.render("forgetPassword-enterOTP", {
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        pageTitle: "Enter The OTP Code",
    });
}

exports.postForgetPassword = async (req, res, next) => {
    const { email } = req.body;
    const otp = crypto.randomInt(1000, 9999).toString();
    console.log(`Generated OTP: ${otp} for email: ${email}`);
    try {
        const user = await userModel.setResetPasswordOTP(email, otp);
        const mailOptions = {
            from: adminAccount,
            to: email.toString(),
            subject: 'Reset Your Password',
            html: `
            <div class='form-container'
              style='width: max-content;padding: 25px;background-color: white;margin: 0 auto;margin-top: 100px;border: 1px solid #ccc;border-radius: 25px;'>
                  <h1 style='color: #24292f;margin-bottom: 5px;'>Dear ${email}</h2>
                  <h4 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Use the following OTP  to reset your password:</h4>
                  <h2 style='background-color: #24292f;color: white;padding: 11px 15px; width: fit-content;margin: 5px auto 15px auto;border-radius: 15px;'>${otp}</h2>
                  <h5 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Thank you for choosing our service!, Best regards, The Garage App Team</h5>  
            </div>
          `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                req.flash("authError", "Failed to send email");
                res.redirect("/forgetPassword-enterOTP?action=forget");
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect("/forgetPassword-enterOTP?action=enterOTP");
            }
        });
    } catch (err) {
        console.error(`Error in postForgetPassword: ${err}`);
        req.flash('authError', err.message);
        return res.redirect('/forgetPassword-enterOTP?action=forget');
    }
};

exports.postResetPassword = async (req, res, next) => {
    let { otp, newPassword } = req.body;
    console.log(`Received OTP: ${otp} and newPassword: ${newPassword}`);
    try {
        const user = await userModel.setResetPassword(otp, newPassword);
        if (user) {
            console.log(`Password successfully reset for user: ${user.email}`);
            return res.redirect("/login-signup?action=login");
        } else {
            throw new Error("Invalid OTP");
        }
    } catch (err) {
        console.error(`Error in postResetPassword: ${err}`);
        req.flash("authError", err.message || "Failed to reset password");
        res.redirect("/forgetPassword-enterOTP?action=enterOTP");
    }
};
