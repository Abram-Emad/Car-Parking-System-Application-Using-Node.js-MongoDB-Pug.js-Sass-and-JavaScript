// Require modules
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Admin = require('./user.model').Admin;
const User = require("./user.model").User;
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./local-storage');

// Connection url
const dbUrl = 'mongodb://localhost:27017/Car-Parking-System-Application';

exports.createNewUserAdmin = (username, email, password, profileImage) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbUrl)
            .then(() => { return Admin.findOne({ email: email }) })
            .then((admin) => {
                if (admin) {
                    mongoose.disconnect();
                    reject('email is used');
                }
                else {
                    return bcrypt.hash(password, 10)
                }
            })
            .then(hashedPassword => {
                let admin = new Admin({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    profileImage: profileImage,
                })
                return admin.save();
            })
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch((error) => {
                mongoose.disconnect();
                reject(error)
            })
    })
};

exports.createNewUser = (username, email, password, profileImagePath, coverImagePath, PaymentCardNumber, PaymentCardExpDate, PaymentCard3thNum) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbUrl)
            .then(() => User.findOne({ email: email }))
            .then((user) => {
                if (user) {
                    mongoose.disconnect();
                    reject('Email is already in use.');
                } else {
                    return bcrypt.hash(password, 10);
                }
            })
            .then(hashedPassword => {
                let user = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    profileImage: profileImagePath,
                    coverImage: coverImagePath,
                    PaymentCardNumber: PaymentCardNumber,
                    PaymentCardExpDate: PaymentCardExpDate,
                    PaymentCard3thNum: PaymentCard3thNum,

                });
                return user.save();
            })
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch((error) => {
                mongoose.disconnect();
                reject(error);
            });
    });
};

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(dbUrl)
            .then(() => {
                return User.findOne({ email: email })
                    .then(user => {
                        if (!user) {
                            return Admin.find()
                                .then(admins => {
                                    return Promise.all(admins.map(admin => {
                                        admin.isLoggedIn = 'false';
                                        return admin.save();
                                    })).then(() => {
                                        return Admin.findOne({ email: email })
                                            .then(admin => {
                                                if (admin) {
                                                    return { role: 'admin', user: admin };
                                                } else {
                                                    return { role: 'invalid' };
                                                }
                                            });
                                    });
                                });
                        } else {
                            if (user.confirmedEmail === 'false') {
                                throw new Error('Your email is not confirmed');
                            } else {
                                return { role: 'user', user: user };
                            }
                        }
                    });
            })
            .then(result => {
                if (result.role === 'invalid') {
                    mongoose.disconnect();
                    reject('Invalid email or password');
                } else {
                    return bcrypt.compare(password, result.user.password)
                        .then(same => {
                            if (!same) {
                                mongoose.disconnect();
                                reject("Password is incorrect");
                            } else {
                                if (result.role === 'admin') {
                                    const loggedInValue = localStorage.getItem('loggedIn');
                                    if (loggedInValue === 'true') {
                                        result.user.isLoggedIn = 'true';
                                    } else {
                                        result.user.isLoggedIn = 'true';
                                    }
                                    return result.user.save();
                                }
                            }
                        })
                        .then(() => {
                            mongoose.disconnect();
                            resolve(result);
                        });
                }
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};