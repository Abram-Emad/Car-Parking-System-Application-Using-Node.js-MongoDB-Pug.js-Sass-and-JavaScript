const mongoose = require('mongoose');
const dbUrl = "mongodb://localhost:27017/Car-Parking-System-Application";
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const GarageSchema = mongoose.Schema({
    garageName: {
        type: String,
        required: true
    },
    garageAddress: {
        type: String,
        required: true
    },
    garageNumSlots: {
        type: Number,
        required: true
    },
    garageSlots: [{
        slotNumber: {
            type: Number,
            required: true
        },
        isOccupied: {
            type: Boolean,
            default: false
        },
        occupiedBy: {
            type: String,
            default: null
        },
        reservedSlotOTP: {
            type: String,
            default: null
        },
        hasTheCarBeenReceived: {
            type: Boolean,
            default: null
        },
    }],
    garageDetails: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const Garages = mongoose.model("Garage", GarageSchema);

exports.Garages = Garages;

exports.createNewGarages = async (garageName, garageAddress, garageNumSlots, garageDetails) => {
    try {
        await mongoose.connect(dbUrl);

        let garage = new Garages({
            garageName: garageName,
            garageAddress: garageAddress,
            garageNumSlots: garageNumSlots,
            garageDetails: garageDetails,
            garageSlots: Array.from({ length: garageNumSlots }, (_, i) => ({
                slotNumber: i + 1,
                isOccupied: false,
                occupiedBy: null,
            }))
        });

        await garage.save();
        mongoose.disconnect();
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getGarages = async () => {
    try {
        await mongoose.connect(dbUrl);
        let garages = await Garages.find().sort({ createdAt: -1 });
        let admin = await userModel.Admin.findOne({ isLoggedIn: 'true' });
        return { garages, admin };
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
};

exports.setReservedSlotInfo = async (slotId, username, otp) => {
    try {
        await mongoose.connect(dbUrl);
        const updatedSlot = await Garages.findOneAndUpdate(
            { "garageSlots._id": mongoose.Types.ObjectId(slotId) },
            {
                $set: {
                    "garageSlots.$.isOccupied": true,
                    "garageSlots.$.occupiedBy": username, // Added missing comma here
                    "garageSlots.$.reservedSlotOTP": otp,
                    "garageSlots.$.hasTheCarBeenReceived": null,
                }
            },
            { new: true }
        );

        if (!updatedSlot) {
            throw new Error("Slot not found or could not be updated");
        }

        return updatedSlot;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(`Failed to set reserved slot info: ${error.message}`);
    }
};

exports.resetReservedSlotInfo = async (slotId) => {
    try {
        await mongoose.connect(dbUrl);

        const updatedSlot = await Garages.findOneAndUpdate(
            { "garageSlots._id": mongoose.Types.ObjectId(slotId) },
            {
                $set: {
                    "garageSlots.$.occupiedBy": null,
                    "garageSlots.$.hasTheCarBeenReceived": false,
                }
            },
            { new: true }
        );

        if (!updatedSlot) {
            throw new Error("Slot not found or could not be updated");
        }

        return updatedSlot;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(`Failed to reset reserved slot info: ${error.message}`);
    }
};

exports.getReceiveYourCar = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id); 
        res.render("Receive-Your-Car", {
            pageTitle: "Receive-Your-Car",
            darkMode: data.darkMode,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/dashboardError');
    }
};

exports.postReceiveYourCar = async (req, res, next) => {
    const { otp } = req.body;
    try {
        const garage = await Garages.findOne({ "garageSlots.reservedSlotOTP": otp });

        if (!garage) {
            throw new Error('Invalid OTP');
        }

        const slot = garage.garageSlots.find(slot => slot.reservedSlotOTP === otp);

        if (!slot) {
            throw new Error('Invalid OTP');
        }

        slot.reservedSlotOTP = null;
        slot.hasTheCarBeenReceived = true;
        slot.isOccupied = false,

            await garage.save();

        res.redirect("https://www.google.com.eg");
    } catch (error) {
        req.flash("authError", error.message);
        res.redirect("/Receive-Your-Car");
    }
};