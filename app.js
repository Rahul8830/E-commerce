const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require('connect-mongodb-session')(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const errorController = require('./controller/error');
const User = require('./model/user');

const MONGODB_URI = "mongodb+srv://Rahul:0uBXEGVdu5kJUlw4@cluster0.b5obq.mongodb.net/shop?retryWrites=true&w=majority";

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype==="image/png" || file.mimetype==="image/jpg" || file.mimetype==="image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));

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
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
});



app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

app.get("/500", errorController.get500);
app.get(errorController.notFound);

app.use((error, req, res, next) => {
    res.status(500).render('500',
        {
            pageTitle: 'Error',
            path: '/500',
            isAuthenticated: req.session.isLoggedIn
        });
});

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