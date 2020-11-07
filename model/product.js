const fs = require("fs");
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
const getProductFromFile = (cb) => {

    fs.readFile(p, (err, content) => {
        if (err || content.length == 0) {
            cb([]);
        }
        else {
            cb(JSON.parse(content));
        }
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    save() {
        
        getProductFromFile(prod => {
            if (this.id === null) {
                this.id = Math.random().toString();
                prod.push(this);
                fs.writeFile(p, JSON.stringify(prod), (err) => {
                    console.log(err);
                })
            }
            else{
                const existingProductIndex = prod.findIndex(product => product.id===this.id);
                prod[existingProductIndex] = this;
                // console.log(this.id);
                fs.writeFile(p, JSON.stringify(prod), (err) => {
                    console.log(err);
                })
            }

        })

    }
    static fetchAll(cb) {
        getProductFromFile(cb);
    }
    static findById(id, cb) {
        getProductFromFile(product => {
            const prod = product.find(p => p.id === id);
            cb(prod);
        })
    }
}