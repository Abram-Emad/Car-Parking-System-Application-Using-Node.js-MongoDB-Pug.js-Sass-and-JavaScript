exports.isAuth = (req, res, next) => {
    if (req.session.userId) next();
    else res.render("homePage", {pageTitle: "Home"});
};

exports.isUserAndAdmin = (req, res, next) => {
    if (req.session.userId || req.session.adminId) next();
    else res.render("homePage", {pageTitle: "Home"});
};

exports.isUserAndNotAuth = (req, res, next) => {
    if (req.session.userId || !req.session.userId) next();
    else res.render("homePage", {pageTitle: "Home"});
};

exports.notAuth = (req, res, next) => {
    if (!req.session.userId) next();
    else res.redirect("/");
};

exports.isAdmin = (req, res, next) => {
    if (req.session.adminId) next();
    else res.redirect("/");
};