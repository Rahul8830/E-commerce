const Product = require('../model/product');
const Cart = require('../model/cart');

exports.getProducts = (req, res) => {
    Product.fetchAll()
    .then(([rows,feilds]) =>{
        res.render('./shop/product-list',
            {
                pageTitle: 'All Products',
                prods: rows,
                path: '/products'
            });
    })
}
exports.getIndex = (req, res) => {
    Product.fetchAll()
    .then(([rows,feilds]) =>{
        res.render('./shop/index',
            {
                pageTitle: 'Shop',
                prods: rows,
                path: '/'
            });
    })
}
exports.getCart = (req, res) => {
    Cart.fetchAll(cart => {
        Product.fetchAll(prods => {
            cartItems = [];
            totalCost = 0;
            for (prod of prods) {
                cartProduct = cart.products.find(p => p.id === prod.id);
                if (cartProduct) {
                    cartItems.push({ productData: prod, qty: cartProduct.qty });
                }
            }
            if(cartItems.length>0)
            {
                totalCost = cart.totalPrice;
            }
            res.render('./shop/cart',
                {
                    pageTitle: 'Cart',
                    path: '/cart',
                    products: cartItems,
                    total: totalCost
                });
        });
    });
}
exports.addToCart = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(product);
        res.redirect("/");
    })
}
exports.deleteCartItem = (req,res) => {
    const id = req.body.productId;
    Product.findById(id,prod =>{
        Cart.deleteProduct(prod,()=>{
            res.redirect("/cart");
        })
    })
}

exports.getOrders = (req, res) => {
    Product.fetchAll((product) => {
        res.render('./shop/orders',
            {
                pageTitle: 'Orders',
                path: '/orders'
            });
    });
}
exports.getDetails = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(([row]) =>{
        console.log(row);
        res.render('./shop/product-detail',
            {
                prod: row[0],
                pageTitle: 'Product Detail',
                path: '/products'
            })
    })
    .catch(err =>{
        console.log(err);
    });
}