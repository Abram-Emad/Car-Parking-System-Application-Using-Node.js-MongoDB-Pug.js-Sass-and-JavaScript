const userModel = require("../models/user.model");

exports.getHome = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const data = await userModel.getUserData(id);
        res.render('homePage', {
            pageTitle: 'Home',
            darkMode: data ? data.darkMode : false,
            SubscriptionPlans: data ? data.SubscriptionPlans : undefined,
            isUser: req.session.userId,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error');
    }
};