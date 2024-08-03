const userModel = require("../models/user.model");
const io = require("../sockets/init.socket");

exports.getAllUsers = async (req, res) => {
    try {
        const { users, totalUsers, admin, ReservedSlots, AvailableSlots } = await userModel.getDataForDashboard();
        const id = req.session.adminId;
        const data = await userModel.getAdminsData(id);

        res.render('users', {
            users,
            admin,
            pageTitle: "Dashboard - Users",
            isAdmin: req.session.adminId, 
            darkMode: data ? data.darkMode : false,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/dashboardError');
    }
};

exports.getDashboard = async (req, res, next) => {
    try {
        const { users, totalUsers, admin, ReservedSlots, AvailableSlots } = await userModel.getDataForDashboard();
        const id = req.session.adminId;
        const data = await userModel.getAdminsData(id);

        res.render('dashboard', {  
            users,
            totalUsers, 
            admin,
            ReservedSlots,
            AvailableSlots,
            pageTitle: "Dashboard",
            isAdmin: req.session.adminId,
            darkMode: data ? data.darkMode : false,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/dashboardError');
    }
};

exports.getDashboardError = async (req, res) => {
    try {
        const { users, totalUsers, admin, ReservedSlots, AvailableSlots } = await userModel.getDataForDashboard();
        const id = req.session.adminId;
        const data = await userModel.getAdminsData(id);

        res.render('dashboardError', {
            users,
            admin,
            pageTitle: "Dashboard - Users",
            isAdmin: req.session.adminId, 
            darkMode: data ? data.darkMode : false,
        });
    } catch (error) {
        console.error(error);
    }
};