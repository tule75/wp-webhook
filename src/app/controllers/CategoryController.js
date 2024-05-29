const woo = require('../../utils/woocommerce');

exports.index = async (req, res) => {
    woo.getCategory().then((result) => {
        res.render('category', {categories: result.data});
    })
    
}

exports.create = async (req, res) => {
    data = {
        name: req.body.name,
    }
    woo.createCategory(data).then(function (result) {
        console.log(result)
        return res.send('success');
    }) .catch(function (err) {
        return res.send(err)
    })
}