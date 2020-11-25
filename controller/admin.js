const Product = require('../model/product');

exports.getAddProduct = (req, res) => {
    res.render('./admin/add-product',
        {
            pageTitle: 'Add Products',
            path: '/admin/add-product',
            editable: false
        });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    const product = new Product(title,price,desc,imageUrl,null,req.user._id);
    product.save()
    .then(result =>{
        res.redirect("/admin/products");
    })
    .catch(err =>{
        console.log(err);
    })
};

exports.getProducts = (req, res) => {
    Product.fetchAll()
    .then(products =>{
        res.render('./admin/products',
            {
                pageTitle: 'All Products',
                prods: products,
                path: '/admin/products'
            });
    })
    .catch(err => console.log(err));
}

exports.getEditProduct = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
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

exports.postEditProduct = (req, res) => {
    const id = req.params.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.description;
    const prod = new Product(title,price,desc,imageUrl,id);
    prod.save()
    .then((result) =>{
        res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId;
    Product.deleteById(id)
    .then(() =>{
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};



