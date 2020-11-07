const Product = require('../model/product');
const Cart = require('../model/cart');

exports.getProducts = (req, res) => {
    Product.fetchAll((product)=>{
        res.render('./shop/product-list',
        {pageTitle: 'All Products',
        prods:product,
        path : '/products'});
    });
}
exports.getIndex = (req, res) => {
    Product.fetchAll((product)=>{
        res.render('./shop/index',
        {pageTitle: 'Shop',
        prods:product,
        path : '/'});
    });
}
exports.getCart = (req, res) => {
    Product.fetchAll((product)=>{
        res.render('./shop/cart',
        {pageTitle: 'cart',
        path : '/cart'});
    });
}
exports.addToCart = (req,res) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product =>{
        Cart.addProduct(product);
        res.redirect("/");
    })
}
exports.getOrders = (req, res) => {
    Product.fetchAll((product)=>{
        res.render('./shop/orders',
        {pageTitle: 'Orders',
        path : '/orders'});
    });
}
exports.getDetails = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product =>{
        res.render('./shop/product-detail',
        {
            prod: product,
            pageTitle: 'Product Detail',
            path : '/products'
        })
    })
}