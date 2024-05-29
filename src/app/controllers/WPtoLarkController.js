const axios = require('axios');
const getAcessToken = require('../../utils/get_access_token.js');
const woo = require('../../utils/woocommerce');

class WPtoLarkController {
    async createProduct(req, res) {
        const value = req.body; 
        const data = {
            'SKU': value.sku,
            'name': value.name,
            permalink: value.permalink,
            date_created: new Date(value.date_created).getTime(),
            price: parseInt(value.price),
            category: value.categories[0].name,
            images: value.images[0].src,
            Size: value.attributes[0].options
        }

        const access_token = await getAcessToken.getAcessToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        } 
        let app_token  = 'T4uvbvCisao02Cs9SOSlzcizg3c';
        let table_id = 'tblO08DqJReDUdQ0';
        await axios.post(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
            fields: data
        }, {
            headers: headers
        }).then(data => {
            console.log("success");
            return res.send('Success');
        }).catch(err => {console.log(err); return res.send(err.message)});
    }

    async updateProduct(req, res) {
        const value = req.body; 
        const data = {
            'SKU': value.sku,
            'name': value.name,
            permalink: value.permalink,
            date_created: new Date(value.date_created).getTime(),
            price: parseInt(value.price),
            category: value.categories[0].name,
            images: value.images[0].src,
            Size: value.attributes[0].options
        }
        const access_token = await getAcessToken.getAcessToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        } 
        const record_id = '';
        // search sku record id
        await axios.post("https://open.larksuite.com/open-apis/bitable/v1/apps/T4uvbvCisao02Cs9SOSlzcizg3c/tables/tblO08DqJReDUdQ0/records/search", {
            "filter": {
                "conjunction": "and",
                "conditions": [
                    {
                        "field_name": "SKU",
                        "operator": "is",
                        "value": [
                            value.sku
                        ]
                    }
                ]
            }
        }, {
            headers: headers
        }).then(async (response) => {
            record_id = response.data.data.items[0].record_id
        }).catch(async (err) => { console.log(err) });

        let app_token  = 'T4uvbvCisao02Cs9SOSlzcizg3c';
        let table_id = 'tblO08DqJReDUdQ0';
        await axios.put(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`, {
            fields: data
        }, {
            headers: headers
        }).then(data => {
            console.log("success");
            return res.send('Success');
        }).catch(err => {console.log(err); return res.send(err.message)});
    }

    // Delete from table
    async deleteProduct(req, res) {
        const id = req.body.id;
        const access_token = await getAcessToken.getAcessToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        } 
        woo.getProduct(id).then(async (product) => {
            // search sku record id
            await axios.post("https://open.larksuite.com/open-apis/bitable/v1/apps/T4uvbvCisao02Cs9SOSlzcizg3c/tables/tblO08DqJReDUdQ0/records/search", {
                "filter": {
                    "conjunction": "and",
                    "conditions": [
                        {
                            "field_name": "SKU",
                            "operator": "is",
                            "value": [
                                product.data.sku
                            ]
                        }
                    ]
                }
            }, {
                headers: headers
            }).then(async (response) => {
                const record_id = response.data.data.items[0].record_id;
                await axios.post("https://open.larksuite.com/open-apis/bitable/v1/apps/T4uvbvCisao02Cs9SOSlzcizg3c/tables/tblO08DqJReDUdQ0/records/batch_delete", {
                    "records": [record_id]
                }, {headers: headers})
                .then(async (response) => {
                    console.log(response.data);
                    return res.send("success");
                }).catch(async (err) => {return res.send(err.message)});
            }).catch(async (err) => { console.log(err);return res.send(err.message) });
        })
    }

    async createOrder(req, res) {
        
    }
}

module.exports = new WPtoLarkController();