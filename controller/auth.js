exports.getLogin = (req,res) =>{
    console.log(req.session.isLoggedIn);
    res.render("./auth/login",{
        path: "/login",
        pageTitle: "Login",
    })
};

exports.postLogin = (req,res) =>{
    req.session.isLoggedIn = true;
    User.findById('5fbf57d71640da18845b9bef')
    .then(user =>{
        req.session.user = user;
        next();
    })
    .catch(err =>{
        console.log(err);
    })
    res.redirect("/");
}