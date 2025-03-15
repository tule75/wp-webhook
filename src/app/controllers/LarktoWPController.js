const axios = require('axios');
const getAcessToken = require('../../utils/get_access_token.js');
const woo = require('../../utils/woocommerce');

class LarktoWPController {
    async createProduct(req, res) {
        try {
            const value = req.body;
            let cate_id = 0;
            if (value.category == " T-shirts") {
                cate_id = 263;
            } else if (value.category == "mugs") {
                cate_id = 265;
            } else if (value.category == "Hoodies") {
                cate_id = 264;
            } else if (value.category == "Tote bags") {
                cate_id = 266;
            }
            else {
                cate_id = 15;
            }
            const attributes = value.size.split(',');
            const data = {
                sku: value.sku,
                'type': 'variable',
                name: value.name,
                regular_price: value.price + '.00',
                attributes: [{name: "Size", options: attributes, visible: true, variation: true}],
                categories: [{id: cate_id}],
                images: [{src: value.images}],
                description: value.description,
                weight: "180",
                manage_stock: true,
                stock_quantity: value.quantity,
            }
            if (value.images)
            await woo.createProduct(data)
            .then(async (response) => {
                // console.log(response + "abcdấdsdfdágsdfggrt");
                let create = []
                for (const val of attributes) {
                    create.push({
                        regular_price: value.price + '.00',
                        image: {"id": response.data.images[0].id},
                        attributes: {id: response.data.attributes[0].id, options: val}})
                    break;
                }
                const vdata = {
                    create: create
                }
                // console.log(vdata);
                console.log(response.data.id)
                await woo.createVariant(vdata, response.data.id)
                .then(data => {
                    return res.send('success');
                })
                .catch(err => {console.log(err.message)});
            }).catch((err) => {
                console.log(err);
            });
        }
        catch (err) {
            // console.log(err);
            return res.send(err);
        }
    }

    // update products
    async updateProduct(req, res) {
        try {
            const value = req.body;
            let cate_id = 0;
            if (value.category == " T-shirts") {
                cate_id = 263;
            } else if (value.category == "mugs") {
                cate_id = 265;
            } else if (value.category == "Hoodies") {
                cate_id = 264;
            } else if (value.category == "Tote bags") {
                cate_id = 266;
            }
            else {
                cate_id = 15;
            }
            const attributes = value.Size.split(',');
            const data = {
                sku: value.sku,
                'type': 'variable',
                name: value.name,
                regular_price: value.price + '.00',
                attributes: [{name: "Size", options: attributes, visible: true, variation: true}],
                categories: [{id: cate_id}],
                images: [{src: value.images}],
                description: value.description,
                stock_quantity: value.quantity
            }
            // console.log(value);
    
            await woo.updateProduct(value.id, data)
            .then(async (response) => {
                // // console.log(response + "abcdấdsdfdágsdfggrt");
                // let create = []
                // for (const val of attributes) {
                //     create.push({
                //         regular_price: value.price + '.00',
                //         image: {"id": response.data.images[0].id},
                //         attributes: {id: response.data.attributes[0].id, options: val}})
                //     break;
                // }
                // const vdata = {
                //     create: create
                // }
                // // console.log(vdata);
                // // console.log(response.data.id)
                // await woo.createVariant(vdata, response.data.id)
                // .then(data => {
                //     return res.send('success');
                // })
                // .catch(err => {console.log(err.message)});
                return res.send('success');
            }).catch((err) => {
                console.log(err);
            });
        }
        catch (err) {
            console.log(err);
            return res.send(err);
        }

    }

    // update order
    async updateOrder(req, res) {
        // console.log("update order", req.body);
        try {
            const value = req.body;
            let status = '';
            if (value.status == "Pending Payment") {
                status = 'pending';
            } else if (value.status == "Processing") {
                status = 'processing';
            } else if (value.status == 'On hold') {
                status = 'on-hold';
            } else {
                status = 'completed';
            }
            console.log(status);
            await woo.updateOrder(value.id, {"status": status})
            .then(data => {
                console.log("success")
            })
            .catch(err => {
                console.log(err.response.data.data);
                return err.message;
            })
        } catch (err) {
            console.log(err.message)
            return err;
        }
    }
}

module.exports = new LarktoWPController;