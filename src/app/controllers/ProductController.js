const woo = require('../../utils/woocommerce');

exports.index = async (req,res) => {res.render('product')};

exports.search = async (req,res) => woo.getProducts({'search':req.body.query})
.then(async (result) => {

    return res.send(result.data)}
)
.catch((error) => res.status(422).send(error.message));

exports.getProducts = async (req, res) => woo.getProducts()
.then(async (result) => {
    return res.render('products.hbs', {products: result.data})}
)
.catch((error) => res.status(422).send(error.message));

exports.deleteProducts = async (req, res) => {
    let id = req.body.id;
    woo.getProduct(id).then(async (result) => {
        if (result.data.stock_status === "instock") {
            res.status(200).send('Sản phẩm vẫn còn hàng và không thể xóa');
        } else {
            woo.deleteProduct(id).then(async (result) => {
                res.send('success')
            })
            .catch(async (err) => {res.send(err.message)});

        }
    })
    .catch(async (err) => {res.send(err.message)});;
}

exports.updateProducts = async (req, res) => {
    let id = req.body.id;
    let price = req.body.new_price;
    woo.updateProduct(id, {price: price, sale_price: price}).then(async (result) => {
        res.send('success')
    })
    .catch(async (err) => {console.log(err);res.send(err.message)});;
}

exports.cProduct = async (req, res) => { res.render('create_product')}

exports.createProduct = async (req, res) => {
    var data = {
        name: req.body.name,
        price: req.body.price,
        regular_price: req.body.price,
        description: req.body.description
    }
    woo.createProduct(data).then(async (result) => {
        console.log(result)
        res.json(result.data);
    }).catch(err => {console.log(err);res.send(err.message)});
}
