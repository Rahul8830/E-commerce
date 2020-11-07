const Product = require('../model/product');

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    const prod = new Product(null, title, imageUrl, price, desc);
    prod.save();
    res.redirect("/");
};
exports.postEditProduct = (req, res) => {
    const id = req.params.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    console.log(id);
    const prod = new Product(id, title, imageUrl, price, desc);
    prod.save();
    res.redirect("/");
};
exports.deleteProduct = (req, res) => {
    const id = req.body.productId;
    prod.save();
    res.redirect("/");
};

exports.getAddProduct = (req, res) => {
    res.render('./admin/add-product',
        {
            pageTitle: 'Add Products',
            path: '/admin/add-product',
            editable: false
        });
};
exports.getEditProduct = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {

        res.render('./admin/add-product',
            {
                pageTitle: 'Edit Products',
                path: '/admin/add-product',
                prod: product,
                editable: true
            });
    })
};


exports.getProducts = (req, res) => {
    Product.fetchAll((product) => {
        res.render('./admin/products',
            {
                pageTitle: 'All Products',
                prods: product,
                path: '/admin/products'
            });
    });
}