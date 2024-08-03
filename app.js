// app.js

const express = require("express");
const path = require("path");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const socketIO = require("socket.io");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.set('strictQuery', false);
const authRouter = require("./routes/auth.route");
const pagesRouter = require("./routes/pages.route");
const profileRouter = require("./routes/userProfile.route");
const ProfileEditorRouter = require("./routes/userProfileEditor.route");
const dashboardRouter = require("./routes/dashboard.route");
const garagesRouter = require("./routes/garges.route");
const homeRouter = require("./routes/home.route");
const app = express();
const server = require("http").createServer(app);

app.use(bodyParser.json());


const io = socketIO(server);

require("./sockets/init.socket")(io);

app.use('/views', express.static(process.cwd() + '/views'));
app.use('/images', express.static(process.cwd() + '/images'));
app.use('/uploads', express.static(process.cwd() + '/uploads'));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "views")));
app.use(flash());

const STORE = new SessionStore({
    uri: 'mongodb://localhost:27017/Car-Parking-System-Application',
    collection: 'sessions',
});

app.use(session({
    secret: 'this is my small secret thAt you cant know so trust me dont try HHHHH......',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: STORE
}));

app.set('view engine', 'pug');
app.set('views', ['views', 'views/pages/Dashboard', 'views/pages/Home-page-and-other-pages', 'views/parts', 'views/includes', 'views/helpers']);
app.locals.basedir = path.join(__dirname, 'views');

app.use("/", authRouter);
app.use("/", pagesRouter);
app.use("/", homeRouter);
app.use("/", dashboardRouter);
app.use("/", garagesRouter);
app.use("/", ProfileEditorRouter);
app.use("/profile", profileRouter);

app.get('/error', (req, res, next) => {
    res.status(500);
    res.render('error', {
        isUser: req.session.userId,
        pageTitle: "Error",
    });
});

app.use((req, res, next) => {
    res.status(404);
    res.render('error', {
        isUser: req.session.userId,
        pageTitle: "Page Not Found",
    });
});

const port = process.env.PORT || 7200;
const ip = '192.168.1.7';

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://${ip}:${port}/`);
});
