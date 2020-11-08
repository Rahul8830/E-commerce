const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require('./controller/error');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use("/admin", adminData);
app.use(shopRoute);
app.use(errorController.notFound);

app.listen(3000);