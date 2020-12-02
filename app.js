const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require('connect-mongodb-session')(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const errorController = require('./controller/error');
const User = require('./model/user');

const MONGODB_URI = "mongodb+srv://Rahul:0uBXEGVdu5kJUlw4@cluster0.b5obq.mongodb.net/shop?retryWrites=true&w=majority";

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const store = new mongodbStore({
    uri: MONGODB_URI,
    collection: "sessions"
});
const csrfProtection = csrf();

app.use(
    session({ secret: "Login Session", resave: false, saveUninitialized: false, store: store })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
      }
    // console.log(req.session.isLoggedIn);
        User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

app.use((req, res, next) =>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);
app.use(errorController.notFound);

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log("Success");
        app.listen(3000);
    })
    .catch(err => console.log(err));

// mongoConnect(() =>{
//     console.log("Success");
//     app.listen(3000);
// })