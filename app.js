const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mongoConnect = require("./util/database").mongoConnect;

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require('./controller/error');
const User = require('./model/user');


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) =>{
    User.findById('5fbe03feeb73f6c0ac7bc6a0')
    .then(user =>{
        req.user = new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(err =>{
        console.log(err);
    })
})
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(errorController.notFound);

mongoConnect(() =>{
    console.log("Success");
    app.listen(3000);
})