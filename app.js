const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require('./controller/error');
const app = express();
const sequelize = require("./util/database");
const Product = require("./model/product");
const User = require("./model/user");
const Cart = require("./model/cart");
const CartItem = require("./model/cart-item");

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) =>{
    User.findByPk(1)
    .then(user =>{
        req.user = user;
        next();
    })
    .catch(err =>{
        console.log(err);
    })
})
app.use("/admin", adminData);
app.use(shopRoute);
app.use(errorController.notFound);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart, {through: CartItem});
Cart.belongsToMany(Product, {through: CartItem});

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
        
    })
    .then(user =>{
        if(!user)
        {
            return User.create({name: "Rahul", email: "test@test.com"});
        }
        return Promise.resolve(user);
    })
    .then(user =>{
        // console.log(user);
        // user.createCart();
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
