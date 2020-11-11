const Product = require('../model/product');

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: desc,
    })
    .then(result =>{
        res.redirect("/admin/products");
    })
    .catch(err =>{
        console.log(err);
    })
};

exports.postEditProduct = (req, res) => {
    const id = req.params.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    Product.findByPk(id)
    .then(product =>{
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = desc;
        return product.save();
    })
    .then(() =>{
        res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId;
    Product.findByPk(id)
    .then(prod =>{
        return prod.destroy();
    })
    .then(() =>{
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
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
    Product.findByPk(productId)
    .then(prod =>{
        res.render('./admin/add-product',
            {
                pageTitle: 'Edit Products',
                path: '/admin/add-product',
                prod: prod,
                editable: true
            });
    })
    .catch(err => console.log(err));
};


exports.getProducts = (req, res) => {
    Product.findAll()
    .then(products =>{
        console.log(req.user.name);
        res.render('./admin/products',
            {
                pageTitle: 'All Products',
                prods: products,
                path: '/admin/products'
            });
    })
    .catch(err => console.log(err));
}