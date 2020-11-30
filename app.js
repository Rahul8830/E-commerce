const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require('connect-mongodb-session')(session);

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

app.use(
    session({secret: "Login Session", resave: false, saveUninitialized: false, store:store})
);

app.use((req,res,next) =>{
    User.findById('5fbf57d71640da18845b9bef')
    .then(user =>{
        req.user = user;
        next();
    })
    .catch(err =>{
        console.log(err);
    })
})
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);
app.use(errorController.notFound);

mongoose.connect(MONGODB_URI)
.then(result =>{
    User.findOne().then(user =>{
        if(!user){
            const u = new User({
                name: "Rahul",
                email: "rahul@test.com",
                cart: {
                    items: []
                }
            });
            u.save();
        }
    });
    console.log("Success");
    app.listen(3000);
})
.catch(err => console.log(err));

// mongoConnect(() =>{
//     console.log("Success");
//     app.listen(3000);
// })