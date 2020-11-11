const Product = require('../model/product');
const Cart = require('../model/cart');

exports.getProducts = (req, res) => {
    Product.findAll()
    .then(products =>{
        res.render('./shop/product-list',
            {
                pageTitle: 'All Products',
                prods: products,
                path: '/products'
            });
    })
    .catch(err => console.log(err));
}

exports.getIndex = (req, res) => {
    Product.findAll()
    .then(products =>{
        res.render('./shop/index',
            {
                pageTitle: 'Shop',
                prods: products,
                path: '/'
            });
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res) => {
    req.user
    .getCart()
    .then(cart =>{
        console.log(cart);
         return cart.getProducts()
         .then(prod =>{
            console.log(prod);
            res.render('./shop/cart',
                {
                    pageTitle: 'Cart',
                    path: '/cart',
                    products: prod
                    // total: totalCost
                });
        })
    })
    .catch(err => console.log(err));
    // Cart.fetchAll(cart => {
    //     Product.fetchAll(prods => {
    //         cartItems = [];
    //         totalCost = 0;
    //         for (prod of prods) {
    //             cartProduct = cart.products.find(p => p.id === prod.id);
    //             if (cartProduct) {
    //                 cartItems.push({ productData: prod, qty: cartProduct.qty });
    //             }
    //         }
    //         if(cartItems.length>0)
    //         {
    //             totalCost = cart.totalPrice;
    //         }
    //         res.render('./shop/cart',
    //             {
    //                 pageTitle: 'Cart',
    //                 path: '/cart',
    //                 products: cartItems,
    //                 total: totalCost
    //             });
    //     });
    // });
}

exports.addToCart = (req, res) => {
    const prodId = req.params.productId;
    let fetchedCart;
    let qty = 1;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        return cart.getProducts({where: { id: prodId}});
    })
    .then(product =>{
        let prod;
        if(product.length>0)
        {
            prod = product[0];
        }
        if(prod)
        {
            let oldQty = prod.cartItem.quantity;
            qty = oldQty+1;
            return prod;
        }
        else{
            return Product.findByPk(prodId)
            
        }
    })
    .then(product =>{
        return fetchedCart.addProduct(product, { through: {quantity: qty}});
    })
    .catch(err => console.log(err));
    res.redirect("/cart");
}

exports.deleteCartItem = (req,res) => {
    const id = req.body.productId;
    req.user
    .getCart()
    .then(cart =>{
        return cart.getProducts( {where: {id: id}});
    })
    .then(products =>{
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(() =>{
        res.redirect("/cart");
    })
    .catch(err => console.log(err));
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
    Product.findByPk(prodId)
    .then(product =>{
        res.render('./shop/product-detail',
            {
                prod: product,
                pageTitle: product.title,
                path: '/products'
            })
    })
    .catch(err => console.log(err));
}