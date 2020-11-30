const User = require("../model/user");

exports.getLogin = (req,res) =>{
    // console.log(req.session.isLoggedIn);
    res.render("./auth/login",{
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: false
    })
};

exports.postLogin = (req,res) =>{
    User.findById('5fbf57d71640da18845b9bef')
    .then(user =>{
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) =>{
            console.log(err);
            res.redirect("/");
        })
    })
    .catch(err =>{
        console.log(err);
    })
};

exports.logout = (req,res) =>{
    req.session.destroy((err) =>{
        console.log(err);
        res.redirect("/");
    });
}