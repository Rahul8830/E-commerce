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
    const image = req.file;
    const price = req.body.price;
    const desc = req.body.description;
    console.log(image);
    if (!image) {
        return res.status(422).render('./admin/add-product',
            {
                pageTitle: 'Add Products',
                path: '/admin/add-product',
                editable: false,
                hasError: true,
                isAuthenticated: req.session.isLoggedIn,
                prod: {
                    title: title,
                    price: price,
                    description: desc
                },
                error: "Attached file should be of type .png, .jpg or .jpeg",
                validationError: []
            });
    }
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
                    price: price,
                    description: desc
                },
                error: errors.array()[0].msg,
                validationError: errors.array()
            });
    }
    const imageUrl = image.path;
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

exports.getProducts = (req, res, next) => {
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.getEditProduct = (req, res, next) => {
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
};

exports.postEditProduct = (req, res, next) => {
    const id = req.params.productId;
    const title = req.body.title;
    const image = req.file;
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
                    price: price,
                    description: desc,
                    _id: id
                },
                error: errors.array()[0].msg,
                validationError: errors.array()
            });
    }
    Product.findById(id)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/");
            }
            product.title = title;
            product.price = price;
            product.description = desc;
            if (image) {
                product.imageUrl = image.path;
            }
            return product.save()
                .then(result => {
                    return res.redirect("/admin/products");
                })
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



