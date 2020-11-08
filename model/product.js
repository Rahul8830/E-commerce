const Cart = require('./cart');
const db = require('../util/database');

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    save() {
        return db.execute("INSERT INTO product(title,imageUrl,price,description) VALUES (?, ?, ?, ?)",
        [this.title,this.imageUrl,this.price,this.description]
        );
    }
    static fetchAll(cb) {
        return db.execute("SELECT * FROM product");
    }
    static findById(id) {
        return db.execute("SELECT * FROM product WHERE id = ?",[id]);
    }
    static delete(id, cb) {
        getProductFromFile(product => {
            const prod = product.find(p => p.id === id);
            const updatedProduct = product.filter(product => product.id !== id);
            Cart.deleteProduct(prod, () => {
                fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
                    console.log(err);
                    cb();
                })
            })

        })
    }
}