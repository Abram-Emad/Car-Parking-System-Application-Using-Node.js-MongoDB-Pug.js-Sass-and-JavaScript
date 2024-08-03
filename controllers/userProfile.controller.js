const bcrypt = require('bcrypt');
const userModel = require("../models/user.model");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const saltRounds = 10;
require('dotenv').config();
const adminAccount = process.env.ADMIN_ACCOUNT;
const sendePass = process.env.SENDE_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: adminAccount,
        pass: sendePass
    }
});

exports.getOwnProfile = async (req, res, next) => {
    try {
        const id = req.session.userId;
        if (!id) return res.redirect('/login-signup?action=login');

        const { users, admin } = await userModel.getUsers();
        const data = await userModel.getUserData(id);

        const garageNames = [...new Set(data.reservedSlots.map(slot => slot.garageName))];
        const numOfSlotsReserved = data.reservedSlots.length;

        res.render('profile', {
            pageTitle: `${data.username}'s Profile`,
            isUser: req.session.userId,
            myId: req.session.userId,
            userName: data.username,
            userEmail: data.email,
            userImage: data.profileImage,
            userCover: data.coverImage,
            darkMode: data ? data.darkMode : false,
            SubscriptionPlans: data.SubscriptionPlans,
            role: data.role,
            users,
            admin,
            userPaymentCardNumber: data.PaymentCardNumber,
            userPaymentCardExpDate: data.PaymentCardExpDate,
            userPaymentCard3thNum: data.PaymentCard3thNum,
            userGarageName: garageNames,
            userNumOfSlotReserved: numOfSlotsReserved,
            isOwner: true,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};

exports.postEditUser = async (req, res, next) => {
    try {
        const id = req.session.userId;
        if (!id) return res.redirect('/login-signup?action=login');
        await userModel.User.findByIdAndUpdate(
            id,
            {
                username: req.body.username,
                email: req.body.email,
                PaymentCardNumber: req.body.PaymentCardNumber,
                PaymentCard3thNum: req.body.PaymentCard3thNum,
                PaymentCardExpDate: req.body.PaymentCardExpDate,
            }
        );

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
};

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
});

exports.upload = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

exports.postProfileImage = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const profileImagePath = req.files['profileImage'][0].path;
        if (!id) return res.redirect('/login-signup?action=login');

        const user = await userModel.User.findById(id);
        if (user.profileImage && fs.existsSync(user.profileImage)) {
            fs.unlinkSync(user.profileImage);
        }

        await userModel.User.findByIdAndUpdate(
            id,
            {
                profileImage: profileImagePath,
            }
        );

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
};

exports.postProfileCover = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const coverImagePath = req.files['coverImage'][0].path;
        if (!id) return res.redirect('/login-signup?action=login');

        const user = await userModel.User.findById(id);
        if (user.coverImage && fs.existsSync(user.coverImage)) {
            fs.unlinkSync(user.coverImage);
        }

        await userModel.User.findByIdAndUpdate(
            id,
            {
                coverImage: coverImagePath,
            }
        );

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
};

exports.sendDeleteAccountOTP = async (req, res) => {
    const id = req.session.userId;
    const username = req.session.name; 
    if (!id) {
        return res.redirect('/login-signup?action=login');
    }

    try {
        const user = await userModel.User.findById(id);

        if (!user) {
            throw new Error('No user found');
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const mailOptions = {
            from: adminAccount,
            to: user.email.toString(),
            subject: 'Delete your Account',
            html: `
            <div class='form-container'
              style='width: max-content;padding: 25px;background-color: white;margin: 0 auto;margin-top: 100px;border: 1px solid #ccc;border-radius: 25px;'>
                  <h1 style='color: #24292f;margin-bottom: 5px;'>Dear ${username}</h2>
                  <h4 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Use the following OTP to confirm Deleting your Account:</h4>
                  <h2 style='background-color: #24292f;color: white;padding: 11px 15px; width: fit-content;margin: 5px auto 15px auto;border-radius: 15px;'>${otp}</h2>
                  <h5 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Thank you for choosing our service!, Best regards, The Garage App Team</h5>  
            </div>
          `
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                req.flash("authError", "Failed to send email");
                return res.redirect("/login-signup?action=signup");
            }

            console.log('Email sent: ' + info.response);
            try {
                await userModel.User.findOneAndUpdate({ email: user.email }, { deleteAccountOTP: hashedOTP }, { new: true });
            } catch (err) {
                req.flash("authError", err);
            }
        });
    } catch (error) {
        console.error(error);
        mongoose.disconnect();
        return res.status(500).send('Internal Server Error');
    }
};

exports.getDdeleteAccount = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id);
        res.render("deleteAccount", {
            pageTitle: "Delete your Account",
            darkMode: data ? data.darkMode : false,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};

exports.deleteUser = async (req, res, next) => {
    const { otp } = req.body;
    const id = req.session.userId;

    if (!id) {
        return res.redirect('/login-signup?action=login');
    }

    try {
        const user = await userModel.User.findById(id);

        if (!user) {
            throw new Error('No user found');
        }

        const match = await bcrypt.compare(otp, user.deleteAccountOTP);

        if (!match) {
            throw new Error('Invalid OTP');
        }

        await userModel.User.findByIdAndDelete(id);

        req.session.destroy(() => {
            res.redirect("/login-signup?action=login");
        });

    } catch (error) {
        console.error(error);
        return res.redirect('/error');
    } finally {
        mongoose.disconnect();
    }
};

exports.sendChangePasswordOTP = async (req, res) => {
    const id = req.session.userId;
    const username = req.session.name; 
    if (!id) {
        return res.redirect('/login-signup?action=login');
    }

    try {
        const user = await userModel.User.findById(id);

        if (!user) {
            throw new Error('No user found');
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const mailOptions = {
            from: adminAccount,
            to: user.email.toString(),
            subject: 'Change Your Password',
            html: `
            <div class='form-container'
              style='width: max-content;padding: 25px;background-color: white;margin: 0 auto;margin-top: 100px;border: 1px solid #ccc;border-radius: 25px;'>
                  <h1 style='color: #24292f;margin-bottom: 5px;'>Dear ${username}</h2>
                  <h4 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Use the following OTP to confirm Changing Your Password:</h4>
                  <h2 style='background-color: #24292f;color: white;padding: 11px 15px; width: fit-content;margin: 5px auto 15px auto;border-radius: 15px;'>${otp}</h2>
                  <h5 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Thank you for choosing our service!, Best regards, The Garage App Team</h5>  
            </div>
          `
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                req.flash("authError", "Failed to send email");
                return res.redirect("/login-signup?action=signup");
            }

            console.log('Email sent: ' + info.response);
            try {
                await userModel.User.findOneAndUpdate({ email: user.email }, { changePasswordOTP: hashedOTP }, { new: true });
            } catch (err) {
                req.flash("authError", err);
            }
        });
    } catch (error) {
        console.error(error);
        mongoose.disconnect();
        return res.status(500).send('Internal Server Error');
    }
};

exports.getChangePassword = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id);
        res.render("changePassword", {
            pageTitle: "Change Your Password",
            darkMode: data ? data.darkMode : false,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};

exports.changePassword = async (req, res, next) => {
    const { otp, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const id = req.session.userId;

    if (!id) {
        return res.redirect('/login-signup?action=login');
    }

    try {
        const user = await userModel.User.findById(id);

        if (!user) {
            throw new Error('No user found');
        }

        const match = await bcrypt.compare(otp, user.changePasswordOTP);

        if (!match) {
            throw new Error('Invalid OTP');
        }

        await userModel.User.findByIdAndUpdate(
            id,
            {
                password: hashedPassword,
            }
        );

        req.session.destroy(() => {
            res.redirect("/login-signup?action=login");
        });

    } catch (error) {
        console.error(error);
        return res.redirect('/error');
    } finally {
        mongoose.disconnect();
    }
};
