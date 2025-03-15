const woo = require('../../utils/woocommerce');
const chatgpt = require("../../utils/chatgpt");
const getAcessToken = require('../../utils/get_access_token')
const axios = require('axios')

class GPTController {
    async generateDescription(req, res) {
        try {
            const value = req.body;
            if (value.categories === null || value.attributes === null) {
                return res.status(401).send('false request');
            }
            // console.log(value);
            const query = 'Từ bây giờ, tôi muốn đóng vai là 1 người chuyên gia về viết SEO và cũng là một chuyên gia am hiểu tường'
                + ' tận về các sản phẩm quần áo. Đoạn giới thiệu có khả năng leo thứ hạng SEO cao,' 
                + 'không lặp từ, lời văn giống con người 100%, lưu loát, có ngắt đoạn. \n Viết một đoạn mô tả "description" chuẩn SEO cho sản phẩm giày đá bóng có tên: '
                + value.name + (value.categories != [] ? '. Và sản phẩm này thuộc loại: ' + value.categories[0].name : '') 
                + (value.description != '' ? '. Sản phẩm này có đoạn mô tả ban đầu như sau: ' + value.description : '')
            let description = ''
            await chatgpt.chatWithGPT(query).then(data => {description = data}) 
    
            let access_token = '';
            await getAcessToken.getAcessToken().then(data => {access_token = data});
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            } 
            let record_id = value.record_id
    
            let app_token  = 'T4uvbvCisao02Cs9SOSlzcizg3c';
            let table_id = 'tblO08DqJReDUdQ0';
            await axios.put(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`, {
                fields: {description: description}
            }, {
                headers: headers
            }).then(data => {
                console.log("success");
                return 'Success';
            }).catch(err => {console.log(err.message); return err.message});
        }
        catch (e) {
            return e.message;
        }
    }


}

module.exports = new GPTController();