const nodemailer = require('nodemailer');
const userModel = require("../models/user.model");
require('dotenv').config();
const adminAccount = process.env.ADMIN_ACCOUNT;
const sendePass = process.env.SENDE_PASS;


exports.getContactUs = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id);
        res.render("Contact-Us", {
            pageTitle: "Contact-Us",
            darkMode: data ? data.darkMode : false,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};

exports.postContactUs = (req, res, next) => {
    const { name, email, mobile, message } = req.body;
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: adminAccount,
            pass: sendePass
        }
    });
    const mailOptions = {
        from: email,
        to: adminAccount,
        subject: 'New message from the contact form',
        html: `
        <div class='form-container'
          style='width: max-content;padding: 25px;background-color: white;margin: 0 auto;margin-top: 100px;border: 1px solid #ccc;border-radius: 25px;'>
              <h1 style='color: #24292f;margin-bottom: 5px;'>Name: ${name}</h2>
              <h1 style='color: #24292f;margin-bottom: 5px;'>Email: ${email}</h2>
              <h1 style='color: #24292f;margin-bottom: 5px;'>Mobile: ${mobile}</h2>
              <h1 style='color: #24292f;margin-bottom: 5px;'>Message: ${message}</h2>
        </div>
      `
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.redirect("/Contact-Us");
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect("/");
        }
    });
};
