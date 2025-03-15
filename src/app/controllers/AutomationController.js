const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chatgpt = require("../../utils/chatgpt");
const facebook = require('../../utils/facebook');
const woo = require('../../utils/woocommerce');

class AutomationController {
    async newVoucherBlog(req, res) {
        const url = 'http://webbanpod.topwebsite.vn/wp-login.php';
        const username = 'admin';
        const password = 'WebBanPod@2024';
        const title = 'Voucher mới';
        const value = req.body;
        const queryBlog = 'Từ bây giờ, tôi muốn đóng vai là 1 người chuyên gia về viết SEO và cũng là một chuyên gia am hiểu tường'
        + ' tận về các sản phẩm áo t-shirts, áo hoodies. Đoạn giới thiệu có khả năng leo thứ hạng SEO cao,' 
        + 'không lặp từ, lời văn giống con người 100%, lưu loát, có ngắt đoạn.'
        + 'Viết một bài blog giới thiệu về sự kiện tung voucher giảm giá của shop với mô tả sự kiện: ' + value.description
        + '. Với mã code là ' + value.code;
        const queryPost = 'Từ bây giờ, tôi muốn đóng vai là 1 người chuyên gia về viết bài đăng facebook và cũng là một chuyên gia am hiểu tường'
        + ' tận về các sản phẩm áo t-shirts, áo hoodies. Đoạn giới thiệu có khả năng tiếp cận khách hàng,' 
        + 'không lặp từ, lời văn giống con người 100%, lưu loát, có ngắt đoạn.'
        + 'Viết một bài blog giới thiệu về sự kiện tung voucher giảm giá của shop với mô tả sự kiện: ' + value.description
        + '. Với mã code là ' + value.code;
        let content = ''
        console.log("truoc do")
        let facebookContent = ''
        await chatgpt.chatWithGPT(queryBlog).then(data => {content = data}).catch(e => {console.log(e.message); return e.message})
        //await chatgpt.chatWithGPT(queryPost).then(data => {facebookContent = data}).catch(e => {console.log(e.message); return e.message})

        try {
            console.log(1)
            //console.log(await facebook.postToFacebook(facebookContent));
            const newPost = {
                title: title,
                content: content,
                status: "publish"
            }

            await woo.createPost(newPost);
        } catch (e) {
            await driver.quit();
            return res.send(e.message);
        }finally {
            await new Promise(resolve => setTimeout(resolve, 5000));

            return res.send('success')
        }
    }

    async PostFacebook(req, res) {
        const result = facebook.postToFacebook(req.body.message);
        return res.send(result)
    }
}

module.exports = new AutomationController();



