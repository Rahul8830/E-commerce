const Product = require('../model/product');
// const Cart = require('../model/cart');
const Order = require("../model/order");

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const PRODUCTS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    let totalProducts;
    const page = +req.query.page || 1;
    Product.countDocuments()
        .then(count => {
            totalProducts = count;
            return Product.find()
                .skip(PRODUCTS_PER_PAGE * (page - 1))
                .limit(PRODUCTS_PER_PAGE)
        })
        .then(products => {
            res.render('./shop/index',
                {
                    pageTitle: 'Shop',
                    prods: products,
                    path: '/',
                    currentPage: page,
                    lastPage: Math.ceil(totalProducts / PRODUCTS_PER_PAGE),
                    nextPage: page + 1,
                    previousPage: page - 1,
                    hasNextPage: page * PRODUCTS_PER_PAGE < totalProducts,
                    hasPreviousPage: page > 1
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.getProducts = (req, res, next) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    Product.find()
        .then(products => {
            res.render('./shop/product-list',
                {
                    pageTitle: 'All Products',
                    prods: products,
                    path: '/products'
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.getDetails = (req, res, next) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('./shop/product-detail',
                {
                    prod: product,
                    pageTitle: product.title,
                    path: '/products'
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.getCart = (req, res, next) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let products = user.cart.items;
            res.render('./shop/cart',
                {
                    pageTitle: 'Cart',
                    path: '/cart',
                    products: products
                    // total: totalCost,
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.addToCart = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(prod => {
            return req.user.addToCart(prod);
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.deleteCartItem = (req, res, next) => {
    const id = req.body.productId;
    req.user
        .removeFromCart(id)
        .then(() => {
            res.redirect("/cart");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let products = user.cart.items.map(i => {
                return { product: { ...i.productId._doc }, quantity: i.quantity };
            });
            let u = {
                email: req.user.email,
                userId: req.user._id
            }
            let order = new Order({ products: products, user: u });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect("/orders");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })

}

exports.getOrders = (req, res, next) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    Order.find({ 'user.userId': req.user._id })
        .then(order => {
            res.render('./shop/orders',
                {
                    orders: order,
                    pageTitle: 'Orders',
                    path: '/orders'
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                console.log("No order found.");
                return next(new Error("No order found."));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                console.log("Unauthorized");
                return next(new Error("Unauthorized"));
            }
            const invoiceName = "invoice-" + orderId + ".pdf";
            const invoicePath = path.join("data", "invoices", invoiceName);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"');
            const accessPromise = (invoicePath) => {
                return new Promise((resolve) => {
                    fs.access(invoicePath, (err) => {
                        if (err) {
                            resolve(0);
                        }
                        else {
                            resolve(1);
                        }
                    })
                });
            }
            accessPromise(invoicePath)
                .then(result => {
                    if (result == 1) {
                        let file = fs.createReadStream(invoicePath);
                        file.pipe(res);
                    }
                    else {
                        const pdfDoc = new PDFDocument();
                        pdfDoc.pipe(fs.createWriteStream(invoicePath));
                        pdfDoc.pipe(res);
                        pdfDoc.fontSize(26).text("Invoice", { underline: true });
                        pdfDoc.text("------------------------------");
                        let total = 0;
                        order.products.forEach(prod => {
                            total += prod.quantity * prod.product.price;
                            pdfDoc.fontSize(18).text(`${prod.product.title}-${prod.quantity}x${prod.product.price}`);
                        });
                        pdfDoc.text("------------------------------");
                        pdfDoc.fontSize(20).text(`Total = ${total}`);
                        pdfDoc.end();
                    }
                })

            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         console.log(err);
            //         return next(err);
            //     }
            //     res.setHeader("Content-Type", "application/pdf");
            //     res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"');
            //     res.send(data);
            // })

            // const file = fs.createReadStream(invoicePath);
            // res.setHeader("Content-Type", "application/pdf");
            // res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"');
            // file.pipe(res);
        })
        .catch(err => {
            console.log(err);
            return next(err);
        })
}