const User = require("../model/user");

const bcrypt = require("bcryptjs");

exports.getLogin = (req, res) => {
    // console.log(req.session.isLoggedIn);
    // console.log(req.flash("errMsg"));
    res.render("./auth/login", {
        path: "/login",
        pageTitle: "Login",
        error: req.flash("errMsg")
    })
};

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash("errMsg","Invalid email or password.");
                return res.redirect("/login");
            }
            bcrypt.compare(pass, user.password)
                .then(match => {
                    if (match) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            return res.redirect("/");
                        })
                    }
                    req.flash("errMsg","Invalid email or password.");
                    res.redirect("/login");
                })
                .catch(err => console.log(err))
        })
        .catch(err => {
            console.log(err);
        })
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        error: req.flash("errMsg")
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
    const confPass = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.flash("errMsg","Email already exists.")
                return res.redirect("/signup");
            }
            return bcrypt.hash(pass, 12)
                .then(hashPass => {
                    let u = new User({
                        email: email,
                        password: hashPass,
                        cart: { items: [] }
                    });
                    return u.save();
                })
                .then(result => {
                    res.redirect("/login");
                })
        })
        .catch(err => console.log(err));

};