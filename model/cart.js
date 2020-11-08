const fs = require("fs");
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');
module.exports = class Cart {
    static addProduct(productData) {
        fs.readFile(p, (err, content) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err && content.length !=0) {
                cart = JSON.parse(content);
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.id === productData.id);
            const existingProduct = cart.products.find(prod => prod.id === productData.id);
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = cart.products[existingProductIndex];
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            }
            else {
                updatedProduct = { id: productData.id, qty: 1 };
                cart.products.push(updatedProduct);
            }
            cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productData.price);
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }
    static deleteProduct(product, cb) {
        fs.readFile(p, (err, content) => {
            if (err || content.length == 0) {
                cb();
            }
            else {
                console.log(content.length);
                const cart = JSON.parse(content);
                const productList = cart.products;
                const reqProd = productList.find(prod => prod.id === product.id);
                if(!reqProd)
                {
                    return cb();
                }
                const qnty = reqProd.qty;
                const updatedProductList = productList.filter(prod => prod.id !== product.id);
                cart.products = updatedProductList;
                cart.totalPrice = cart.totalPrice - qnty * product.price;
                fs.writeFile(p, JSON.stringify(cart), err => {
                    console.log(err);
                    cb();
                })
            }
        })
    }
    static fetchAll(cb)
    {
        fs.readFile(p,(err, content) => {
            if(err || content.length==0)
            {
                cb([]);
            }
            else{
                const cart = JSON.parse(content);
                cb(cart);
            }
        })
    }

}