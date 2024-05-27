const woo = require('../../config/woocommerce');

exports.index = async (req, res) => {
    woo.getCustomers().then((result) => {
        res.render('user', {customers: result.data});
    })
    .catch((err) => { res.send(err); });
}

exports.create = async (req, res) => {
    data = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password
    }
    woo.createCustomer(data).then(function (result) {
        return res.send('success');
    }) .catch(function (err) {
        return res.send(err)
    })
}