const fs = require("fs");
const path = require('path');
const p = path.join(path.dirname(require.main.filename),'data','cart.json');
module.exports = class Cart {
    static addProduct(productData)
    {
        fs.readFile(p,(err,content)=>{
            let cart = {products: [], totalPrice: 0};
            if(!err)
            {
                cart = JSON.parse(content);
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.id === productData.id);
            const existingProduct = cart.products.find(prod => prod.id === productData.id);
            let updatedProduct;
            if(existingProduct)
            {
                updatedProduct = cart.products[existingProductIndex];
                updatedProduct.qty = updatedProduct.qty+1;
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                updatedProduct = {id: productData.id,qty: 1};
                cart.products.push(updatedProduct);
            }
            cart.totalPrice = cart.totalPrice+productData.price;
            fs.writeFile(p,JSON.stringify(cart),err =>{
                console.log(err);
            })
        })
    }
}