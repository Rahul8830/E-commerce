const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mongoConnect = require("./util/database").mongoConnect;

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require('./controller/error');


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req,res,next) =>{
//     User.findByPk(1)
//     .then(user =>{
//         req.user = user;
//         next();
//     })
//     .catch(err =>{
//         console.log(err);
//     })
// })
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(errorController.notFound);

mongoConnect(() =>{
    console.log("Success");
    app.listen(3000);
})