const Product = require('../model/product');
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    res.render('./admin/add-product',
        {
            pageTitle: 'Add Products',
            path: '/admin/add-product',
            editable: false,
            hasError: false,
            isAuthenticated: req.session.isLoggedIn,
            error: [],
            validationError: []
        });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('./admin/add-product',
            {
                pageTitle: 'Add Products',
                path: '/admin/add-product',
                editable: false,
                hasError: true,
                isAuthenticated: req.session.isLoggedIn,
                prod: {
                    title: title,
                    imageUrl: imageUrl,
                    price: price,
                    description: desc
                },
                error: errors.array()[0].msg,
                validationError: errors.array()
            });
    }
    const product = new Product({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: desc,
        userId: req.user._id
    });
    product.save()
        .then(result => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
};

exports.getProducts = (req, res) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    Product.find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('userId','name')
        .then(products => {
            res.render('./admin/products',
                {
                    pageTitle: 'All Products',
                    prods: products,
                    path: '/admin/products',
                    isAuthenticated: req.session.isLoggedIn
                });
        })
        .catch(err => console.log(err));
}

exports.getEditProduct = (req, res) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    const productId = req.params.productId;
    Product.findById(productId)
        .then(prod => {
            // console.log(prod.userId.toString()+" "+req.user._id);
            if (prod.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/");
            }
            res.render('./admin/add-product',
                {
                    pageTitle: 'Edit Products',
                    path: '/admin/add-product',
                    prod: prod,
                    editable: true,
                    hasError: false,
                    isAuthenticated: req.session.isLoggedIn,
                    error: [],
                    validationError: []
                });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const id = req.params.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('./admin/add-product',
            {
                pageTitle: 'Edit Products',
                path: '/admin/add-product',
                editable: true,
                hasError: true,
                isAuthenticated: req.session.isLoggedIn,
                prod: {
                    title: title,
                    imageUrl: imageUrl,
                    price: price,
                    description: desc,
                    _id: id
                },
                error: errors.array()[0].msg,
                validationError: errors.array()
            });
    }
    Product.updateOne({ _id: id, userId: req.user._id }, {
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: desc
    })
        .then((result) => {
            res.redirect("/");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteOne({ _id: id, userId: req.user._id })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
};



