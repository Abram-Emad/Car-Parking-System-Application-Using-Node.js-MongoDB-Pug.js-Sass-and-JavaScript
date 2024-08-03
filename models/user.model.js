const mongoose = require("mongoose");
const garageModel = require("../models/garages.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const dbUrl = "mongodb://localhost:27017/Car-Parking-System-Application";

// User schema
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    profileImage: String,
    coverImage: String,
    createdAt: { type: Date, default: Date.now() },
    role: { type: String, default: "user" },
    confirmedEmail: { type: String, default: "false" },
    confirmEmailOTP: String,
    deleteAccountOTP: String,
    changePasswordOTP: String,
    resetPasswordOTP: String,
    PaymentCardNumber: String,
    PaymentCardExpDate: String,
    PaymentCard3thNum: String,
    SubscriptionPlans: String,
    darkMode: { type: String, default: "false" },
    reservedSlots: [
        {
            garageName: String,
            slotName: String,
            reservationPeriod: String,
        }
    ],
});


const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
    role: { type: String, default: 'admin' },
    confirmedEmail: { type: String, default: 'true' },
    isLoggedIn: { type: String, default: "false" },
    darkMode: { type: String, default: "false" },
});

const User = mongoose.model("user", userSchema);
const Admin = mongoose.model("admin", adminSchema);

exports.User = User;
exports.Admin = Admin;

exports.getAdmin = async (req, res) => {
    try {
        await mongoose.connect(dbUrl);
        let admin = await Admin.findOne({ isLoggedIn: 'true' });
        return admin;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
};

exports.getUsers = async () => {
    try {
        await mongoose.connect(dbUrl);
        let users = await User.find();
        let admin = await Admin.findOne({ isLoggedIn: 'true' });
        return { users, admin };
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
};

exports.getDataForDashboard = async (req) => {
    let connection;
    try {
        connection = await mongoose.connect(dbUrl);
        let users = await User.find().sort({ createdAt: -1 }).limit(3);
        let totalUsers = await User.countDocuments();
        let admin = await Admin.findOne({ isLoggedIn: 'true' });
        let garages = await garageModel.Garages.find();
        let ReservedSlots = 0;
        for (let garage of garages) {
            for (let slot of garage.garageSlots) {
                if (slot.isOccupied) {
                    ReservedSlots++;
                }
            }
        }
        let AvailableSlots = 0;
        for (let garage of garages) {
            for (let slot of garage.garageSlots) {
                if (!slot.isOccupied) {
                    AvailableSlots++;
                }
            }
        }
        if (admin) {
            return { users, totalUsers, admin, ReservedSlots, AvailableSlots };
        } else {
            throw new Error("No such admin found");
        }
    } catch (err) {
        throw err;
    }
};

exports.getUserData = (id) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbUrl)
            .then(() => {
                return User.findById(id);
            })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.getAdminsData = (id) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbUrl)
            .then(() => {
                return Admin.findById(id);
            })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.getAdmins = async (query) => {
    try {
        await mongoose.connect(dbUrl);
        let admins = await Admin.find(query);
        return admins;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getAdminsData = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(dbUrl)
            .then(() => {
                return Admin.findById(id); // Find by admin id
            })
            .then((data) => {
                mongoose.disconnect();
                resolve(data);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.postDarkMode = async (req, res) => {
    try {
        let id, model;

        if (req.session.userId) {
            id = req.session.userId;
            model = User;
        } else if (req.session.adminId) {
            id = req.session.adminId;
            model = Admin;
        } 

        await mongoose.connect(dbUrl);

        const user = await model.findById(id);

        user.darkMode = user.darkMode === 'true' ? 'false' : 'true'; // Assign the toggled value back to user.darkMode
        await user.save();

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.postPlanA = async (req, res) => {
    try {
        const id = req.session.userId;

        await mongoose.connect(dbUrl);

        const user = await User.findById(id);

        user.SubscriptionPlans = 'planA';
        await user.save();

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.postPlanB = async (req, res) => {
    try {
        const id = req.session.userId;

        await mongoose.connect(dbUrl);

        const user = await User.findById(id);

        user.SubscriptionPlans = 'planB';
        await user.save();

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.postPlanC = async (req, res) => {
    try {
        const id = req.session.userId;

        await mongoose.connect(dbUrl);

        const user = await User.findById(id);

        user.SubscriptionPlans = 'planC';
        await user.save();

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.postResetPlan = async (req, res) => {
    try {
        const id = req.session.userId;

        await mongoose.connect(dbUrl);

        const user = await User.findById(id);

        user.SubscriptionPlans = undefined;
        await user.save();

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.setConfirmEmailOTP = (email, otp) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbUrl)
            .then(async () => {
                const hashedOTP = await bcrypt.hash(otp, saltRounds);
                const updatedUser = await User.findOneAndUpdate({ email: email }, { confirmEmailOTP: hashedOTP }, { new: true });
                mongoose.disconnect();
                resolve(updatedUser);
            })
            .catch(error => {
                mongoose.disconnect();
                reject(error);
            });
    });
};

exports.setConfirmedEmail = async (otp) => {
    try {
        await mongoose.connect(dbUrl);

        const users = await User.find({ confirmEmailOTP: { $exists: true } }); // 🕵️‍♂️ Check all users with confirmEmailOTP

        for (const user of users) {
            const match = await bcrypt.compare(otp.toString(), user.confirmEmailOTP);

            if (match) {
                user.confirmedEmail = true;
                user.confirmEmailOTP = undefined;
                await user.save();
            }
        }

        mongoose.disconnect();

        // 🎉 Successfully confirmed email for all users
        return users;
    } catch (error) {
        mongoose.disconnect();
        throw error;
    }
};

exports.setReservedSlotInformation = (userId, selectedGarageName, slotName, timeInSeconds) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbUrl)
            .then(async () => {
                return User.findByIdAndUpdate(
                    userId,
                    {
                        $push: {
                            reservedSlots: {
                                garageName: selectedGarageName,
                                slotName: slotName,
                                reservationPeriod: timeInSeconds,
                            }
                        }
                    },
                );
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                mongoose.disconnect();
                reject(error);
            });
    });
};

exports.resetReservedSlotInformation = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbUrl)
            .then(() => {
                return User.findByIdAndUpdate(
                    userId,
                    {
                        $set: { reservedSlots: [] },
                        new: true
                    }
                );
            })
            .then((updatedUser) => {
                resolve(updatedUser);
            })
            .catch(error => {
                mongoose.disconnect();
                reject(error);
            });
    });
};

exports.setResetPasswordOTP = async (email, otp) => {
    try {
        await mongoose.connect(dbUrl);
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const user = await User.findOne({ email: email });
        if (!user) {
            mongoose.disconnect();
            console.error(`No user found with email: ${email}`);
            throw new Error('There is no email saved in the database that matches this email');
        } else {
            user.resetPasswordOTP = hashedOTP;
            await user.save();
            mongoose.disconnect();
            console.log(`OTP set for email: ${email}`);
            return user;
        }
    } catch (error) {
        mongoose.disconnect();
        console.error(`Error in setResetPasswordOTP: ${error}`);
        throw error;
    }
};

exports.setResetPassword = async (otp, newPassword) => {
    try {
        await mongoose.connect(dbUrl);
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const users = await User.find({ resetPasswordOTP: { $exists: true } });
        for (const user of users) {
            const match = await bcrypt.compare(otp, user.resetPasswordOTP);
            console.log(`OTP match for user ${user.email}: ${match}`);
            if (match) {
                user.password = hashedPassword;
                user.resetPasswordOTP = undefined; // Reset OTP after password change
                await user.save();
                mongoose.disconnect();
                console.log(`Password reset for user: ${user.email}`);
                return user;
            }
        }
        mongoose.disconnect();
        console.error('Invalid OTP');
        throw new Error('Invalid OTP');
    } catch (error) {
        mongoose.disconnect();
        console.error(`Error in setResetPassword: ${error}`);
        throw error;
    }
};

exports.adminUserExists = async (email) => {
    try {
        await mongoose.connect(dbUrl);
        const adminUser = await Admin.findOne({ email, role: "admin" });
        return adminUser !== null;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
};