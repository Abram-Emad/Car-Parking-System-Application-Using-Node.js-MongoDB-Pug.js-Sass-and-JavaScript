const garageModel = require("../models/garages.model");
const dbUrl = "mongodb://localhost:27017/Car-Parking-System-Application";
const mongoose = require('mongoose');
const userModel = require("../models/user.model");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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

exports.getAllGarages = async (req, res) => {
  try {
    const id = req.session.userId;
    const data = await userModel.getUserData(id);
    const { garages, admin } = await garageModel.getGarages();
    res.render('Garages', {
      garages,
      darkMode: data ? data.darkMode : false,
      SubscriptionPlans: data ? data.SubscriptionPlans : undefined,
      pageTitle: "Garages",
      isUser: req.session.userId,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/error');
  }
};

exports.postOccupancyValues = async (req, res) => {
  const { slotId, selectedGarageName, slotName, timeInSeconds } = req.body;
  const slots = [{ slotId, selectedGarageName, slotName, timeInSeconds }]; // Wrap the slot data in an array

  if (req.session) {
    req.session.startReserve = 'true';
    req.session.slots = slots;

    if (req.session.startReserve === 'true') {
      req.session.garageName = selectedGarageName;
      for (let slot of slots) {
        req.session.slotId = slot.slotId;
        req.session.selectedGarageName = slot.selectedGarageName;
        req.session.slotName = slot.slotName;
        req.session.timeInSeconds = slot.timeInSeconds;
        await exports.updateSlotOccupancy(req, res);
      }
      req.session.startReserve = 'false';
    }

    res.status(200).send('Values stored in session successfully');
  } else {
    res.status(500).send('Session not available');
  }
};

exports.updateSlotOccupancy = async (req, res) => {
  const startReserve = req.session.startReserve;
  const slotId = req.session.slotId;
  const selectedGarageName = req.session.selectedGarageName;
  const slotName = req.session.slotName;
  let timeInSeconds = req.session.timeInSeconds;

  const userId = req.session.userId;
  const username = req.session.name; 
  const userEmail = req.session.email;
  const otp = crypto.randomInt(1000, 9999).toString();
  const mailOptions = {
    from: adminAccount,
    to: userEmail,
    subject: 'Welcome to our garage app service',
    html: `
      <div class='form-container'
        style='width: max-content;padding: 25px;background-color: white;margin: 0 auto;margin-top: 100px;border: 1px solid #ccc;border-radius: 25px;'>
            <h1 style='color: #24292f;margin-bottom: 5px;'>Dear ${username}</h2>
            <h4 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Use the following OTP to receive your car:</h4>
            <h2 style='background-color: #24292f;color: white;padding: 11px 15px; width: fit-content;margin: 5px auto 15px auto;border-radius: 15px;'>${otp}</h2>
            <h5 style='color: #24292f;margin-top: 0;margin-bottom: 10px;'>Thank you for choosing our service!, Best regards, The Garage App Team</h5>  
      </div>
    `
  };

  try {
    await garageModel.setReservedSlotInfo(slotId, username, otp);
    await userModel.setReservedSlotInformation(userId, selectedGarageName, slotName, timeInSeconds);

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Failed to send email. Please try again.");
      }

      console.log('Email sent: ' + info.response);

      if (timeInSeconds <= 0) {
        return res.status(400).send("Please provide a valid timeInSeconds value greater than 0");
      }

      let countdownInterval = setInterval(async () => {
        timeInSeconds--;

        if (timeInSeconds === 0) {
          clearInterval(countdownInterval);

          await garageModel.resetReservedSlotInfo(slotId);
          await userModel.resetReservedSlotInformation(userId);
        }
      }, 1000);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update slot occupancy");
  }
};
