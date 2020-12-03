const User = require("../model/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ac87a7728203dc",
        pass: "65a2b673df896d"
    }
});

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
                req.flash("errMsg", "Invalid email or password.");
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
                    req.flash("errMsg", "Invalid email or password.");
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
                req.flash("errMsg", "Email already exists.")
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
                    return transporter.sendMail({
                        to: email,
                        from: "shop@node.com",
                        subject: "Signup succeeded",
                        html: "<h1>You successfully signed up!</h1>"
                    })
                        .catch(err => console.log(err));
                })
        })
        .catch(err => console.log(err));
};
exports.getReset = (req, res, next) => {
    res.render("./auth/reset", {
        path: '/reset',
        pageTitle: 'Reset Password',
        error: req.flash("errMsg")
    })
}

exports.sendReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset");
        }
        let token = buffer.toString('hex');
        let email = req.body.email;
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash("errMsg", "No account with that email found");
                    return res.redirect("/reset");
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect("/");
                return transporter.sendMail({
                    to: email,
                    from: "shop@node.com",
                    subject: "Password Reset",
                    html: `
                            <p>You requested a password reset</p>
                            <p><a href="http://localhost:3000/reset/${token}">Click this link</a> to set a new password</p>
                        `
                })
                    .catch(err => console.log(err));
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render("./auth/new-password", {
                path: '/reset',
                pageTitle: 'Reset Password',
                error: req.flash("errMsg"),
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => console.log(err))
};

exports.changePassword = (req, res, next) => {
    const newPassword = req.body.password;
    const token = req.body.passwordToken;
    const uid = req.body.userId;
    let u;
    User.findOne({_id: uid, resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
    .then(user =>{
        u = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPass =>{
        u.password = hashedPass;
        u.resetToken = undefined;
        u.resetTokenExpiration = undefined;
        return u.save();
    })
    .then(result =>{
        res.redirect("/login");
    })
    .catch(err => console.log(err))
}