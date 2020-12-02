const Product = require('../model/product');
// const Cart = require('../model/cart');
const Order = require("../model/order");

exports.getIndex = (req, res) => {
    // if(req.session.isLoggedIn==undefined){
    //     req.session.isLoggedIn = false;
    // }
    Product.find()
        .then(products => {
            res.render('./shop/index',
                {
                    pageTitle: 'Shop',
                    prods: products,
                    path: '/'
                });
        })
        .catch(err => console.log(err));
}

exports.getProducts = (req, res) => {
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
        .catch(err => console.log(err));
}

exports.getDetails = (req, res) => {
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
        .catch(err => console.log(err));
}

exports.getCart = (req, res) => {
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
            .catch(err => console.log(err));
}

exports.addToCart = (req, res) => {
        const prodId = req.params.productId;
        Product.findById(prodId)
            .then(prod => {
                return req.user.addToCart(prod);
            })
            .then(result => {
                res.redirect("/cart");
            })
}

exports.deleteCartItem = (req, res) => {
        const id = req.body.productId;
        req.user
            .removeFromCart(id)
            .then(() => {
                res.redirect("/cart");
            })
            .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
        req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(user => {
                let products = user.cart.items.map(i => {
                    return { product: { ...i.productId._doc }, quantity: i.quantity };
                });
                let u = {
                    name: req.user.name,
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
            .catch(err => console.log(err));

}

exports.getOrders = (req, res) => {
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
            .catch(err => console.log(err));
}

