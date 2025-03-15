const axios = require('axios');
const getAcessToken = require('../../utils/get_access_token.js');
const woo = require('../../utils/woocommerce');
const GPTController = require('./GPTController.js')

class WPtoLarkController {
    async createProduct(req, res) {
        // return res.send('success');
        const value = req.body; 
        let access_token = '';
        await getAcessToken.getAcessToken().then(data => {access_token = data});
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        } 
        console.log(access_token);
        // console.log("cái này sau access",req);
        await new Promise((resolve) => setTimeout(resolve, 3000));
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
            console.log(value);
            if (response.data.data.items != null) {
                req.body.record_id = response.data.data.items[0].record_id;
                await new WPtoLarkController().updateProduct(req, res);
                await GPTController.generateDescription(req, res)
            } else {
                const data = {
                    'id': parseInt(value.id),
                    'SKU': value.sku,
                    'name': value.name,
                    permalink: value.permalink,
                    date_created: new Date(value.date_created).getTime(),
                    price: parseInt(value.price ?? 0),
                    category: value.categories[0] ? value.categories[0].name : '',
                    images: value.images[0]?.src ?? "",
                    description: value.description,
                    total_quantity: parseInt(value.stock_quantity),
                    sold_quantity: 0
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
        }).catch(async (err) => { console.log(err) });

    }

    async updateProduct(req, res) {
        const value = req.body; 
        let access_token = '';
        await getAcessToken.getAcessToken().then(data => {access_token = data});
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        } 
        let record_id = value.record_id;
        // console.log(value);
        let data
        try {
            if (value.regular_price == '') {
                data = {
                    id: value.id,
                    'SKU': value.sku,
                    'name': value.name,
                    permalink: value.permalink,
                    date_created: new Date(value.date_created).getTime(),
                    images: value.images[0].src,
                    description: value.description,
                    total_quantity: parseInt(value.stock_quantity),
                }
            } else {
                data = {
                    id: value.id,
                    'SKU': value.sku,
                    'name': value.name,
                    permalink: value.permalink,
                    date_created: new Date(value.date_created).getTime(),
                    price: parseInt(value.regular_price),
                    images: value.images[0]?.src ?? "",
                    description: value.description ?? "",
                    total_quantity: parseInt(value.stock_quantity),
                }
            }
        }
        
        catch (e) { return res.send(e.message)};
        

        let app_token  = 'T4uvbvCisao02Cs9SOSlzcizg3c';
        let table_id = 'tblO08DqJReDUdQ0';
        await axios.put(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`, {
            fields: data
        }, {
            headers: headers
        }).then(data => {
            console.log("success");
            return res.send('Success');
        }).catch(err => {console.log(err.message); return res.send(err.message)});
    }

    // Delete from table
    async deleteProduct(req, res) {
        console.log(req.body)
        const id = req.body.id;
        let access_token = '';
        await getAcessToken.getAcessToken().then(data => {access_token = data});
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
                let record_id = response.data.data.items[0].record_id;
                await axios.post("https://open.larksuite.com/open-apis/bitable/v1/apps/T4uvbvCisao02Cs9SOSlzcizg3c/tables/tblO08DqJReDUdQ0/records/batch_delete", {
                    "records": [record_id]
                }, {headers: headers})
                .then(async (response) => {
                    // console.log(response.data);
                    return res.send("success");
                }).catch(async (err) => {return res.send(err.message)});
            }).catch(async (err) => { console.log(err.response);return res.send(err.message) });
        })
    }

    async createOrder(data) {
        console.log(data)
        const value = 
            {
                'ID': parseInt(data.id),
                'Tên khách hàng': (data.billing?.first_name ? data.billing?.first_name : '') + ' ' + (data.billing?.last_name ? data.billing?.last_name : '' ),
                'Địa chỉ': data.shipping?.address_1 + ', ' + data.shipping?.city + ', ' + data.shipping?.state + ' ' + data.shipping?.country,
                'Ngày tạo': new Date(data.date_created).getTime(),
                'Tổng số tiền': parseInt(data.total),
                'Trạng thái': data.status,
            }
        const p_value = data.line_items;
        const access_token = await getAcessToken.getAcessToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        } 

        let app_token  = 'T4uvbvCisao02Cs9SOSlzcizg3c';
        let table_id = 'tblZLNAYw86usum7';
        // Tạo order
        await axios.post(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
            fields: value
        }, {
            headers: headers
        }).then(async data => {
            for (const product of p_value) {
                // search sku record id
                await axios.post("https://open.larksuite.com/open-apis/bitable/v1/apps/T4uvbvCisao02Cs9SOSlzcizg3c/tables/tblO08DqJReDUdQ0/records/search", {
                    
                        "filter": {
                            "conjunction": "and",
                            "conditions": [
                                {
                                    "field_name": "SKU",
                                    "operator": "is",
                                    "value": [
                                        product.sku
                                        // "P1GD243460"
                                    ]
                                }
                            ]
                        }
                    
                }, {
                    headers: headers
                }).then(async sku_data => {
                    let table_id = 'tblUxmxHDi7C5kSP';
                    // tạo order details
                    await axios.post(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
                        fields: {
                            "Mã đơn hàng": [data.data.data.record.id],
                            "SKU": [product.sku],
                            'Số lượng': parseInt(product.quantity)
                        }
                    }, {
                        headers: headers
                    }).then(function (data) 
                        {
                            // console.log(data)
                        });
                })
            }
            console.log("success");
        }).catch(err => {console.log(err);});
    }

    // async updateOrder(req, res) {
    //     const data = req.body;
    //     const value = 
    //         {
    //             'ID': parseInt(data.id),
    //             'Tên khách hàng': data.billing.first_name + ' ' + data.billing.last_name,
    //             'Địa chỉ': data.shipping.address_1 + ', ' + data.shipping.city + ', ' + data.shipping.state + ' ' + data.shipping.country,
    //             'Ngày tạo': new Date(data.date_created).getTime(),
    //             'Tổng số tiền': parseInt(data.total),
    //             'Trạng thái': data.status,
    //         }
    // }
}

module.exports = new WPtoLarkController();