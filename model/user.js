const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const getDb = require("../util/database").getDb;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    save() {
        let db = getDb();
        return db.collection("users")
            .insertOne(this);
    }
    addToCart(product) {
        let prodIndex = this.cart.items.findIndex(p => {
            return p.productId.toString() == product._id.toString();
        });
        let newQty = 1;
        let upCartItems = this.cart.items;
        if (prodIndex >= 0) {
            newQty = this.cart.items[prodIndex].quantity + 1;
            upCartItems[prodIndex].quantity = newQty;
        }
        else {
            upCartItems.push({ productId: product._id, quantity: newQty });
        }
        let updatedCart = { items: upCartItems };
        // this.cart = updatedCart;
        // const updatedCart = {items: [{productId:new ObjectId(product._id), quantity: 1}] };
        let db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            )

    }

    getCart() {
        let db = getDb();
        let prodIds = this.cart.items.map(p => p.productId);
        return db.collection("products")
            .find({ _id: { $in: prodIds } })
            .toArray()
            .then(prod => {
                return prod.map(p => {
                    p.quantity = this.cart.items.find(i => {
                        return p._id.toString() === i.productId.toString();
                    }).quantity;
                    return p;
                })
            })
    }

    deleteItemFromCart(prodId) {
        let updatedCartItems = this.cart.items.filter(i => {
            return prodId.toString() !== i.productId.toString();
        });
        let db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            )
    }

    addOrder() {
        let db = getDb();
        return this.getCart()
            .then(products => {
                let userInfo = {
                    userId: new ObjectId(this._id),
                    name: this.username
                }
                let order = {
                    items: products,
                    user: userInfo
                }
                return db.collection('orders')
                    .insertOne(order)
            })
            .then(result => {
                this.cart = { items: [] };
                return db.collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            });
    }

    getOrder() {
        let db = getDb();
        return db.collection('orders').find({ 'user.userId': new ObjectId(this._id) })
            .toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db.collection("users")
            .findOne({ _id: new ObjectId(userId) });
    }
}

module.exports = User;