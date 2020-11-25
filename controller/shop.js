const Product = require('../model/product');
// const Cart = require('../model/cart');

exports.getIndex = (req, res) => {
    Product.fetchAll()
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
    Product.fetchAll()
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
    req.user
        .getCart()
        .then(products => {
            res.render('./shop/cart',
                {
                    pageTitle: 'Cart',
                    path: '/cart',
                    products: products
                    // total: totalCost
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
        .deleteItemFromCart(id)
        .then(() => {
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(result => {
            res.redirect("/orders");
        })
        .catch (err => console.log(err));
}

exports.getOrders = (req, res) => {
    req.user
    .getOrder()
    .then(order =>{
        console.log(order);
        res.render('./shop/orders',
                {
                    orders: order,
                    pageTitle: 'Orders',
                    path: '/orders'
                })
    })
    .catch(err => console.log(err));
}

