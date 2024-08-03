const userModel = require("../models/user.model");

exports.getTeamMembers = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id);
        res.render("Team-Members", {
            pageTitle: "Team-Members",
            darkMode: data ? data.darkMode : false,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};

exports.getPrivacyDataPolicy = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id);
        res.render("privacyDataPolicy", {
            pageTitle: "Privacy Data Policy",
            darkMode: data ? data.darkMode : false,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};
