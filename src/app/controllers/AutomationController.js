const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chatgpt = require("../../utils/chatgpt");

async function loginToWordpress(driver, url, username, password) {
    await driver.get(url);
    await driver.wait(until.elementLocated(By.css('#user_login')), 30000)

    await driver.findElement(By.id('user_login')).sendKeys(username);

    await driver.findElement(By.id('user_pass')).sendKeys(password);

    await driver.findElement(By.id('wp-submit')).click();
}

async function createNewPost(driver, title, content) {
    await driver.get('http://donghouiters.id.vn/wp-admin/post-new.php');

    await driver.findElement(By.css('.wp-block.wp-block-post-title.block-editor-block-list__block.editor-post-title.editor-post-title__input.rich-text')).sendKeys(title);

    const body = await driver.findElement(By.css('.is-root-container.is-desktop-preview.is-layout-flow.wp-block-post-content-is-layout-flow.wp-block-post-content.block-editor-block-list__layout'));
    await body.findElement(By.css('p')).sendKeys(content);

    await driver.findElement(By.css('.components-button.editor-post-publish-panel__toggle.editor-post-publish-button__button.is-primary.is-compact')).click();
}

class AutomationController {
    async newVoucherBlog(req, res) {
        const url = 'http://donghouiters.id.vn/wp-login.php';
        const username = 'root';
        const password = 'root';
        const title = 'Voucher mới';
        const value = req.body;
        const query = 'Từ bây giờ, tôi muốn đóng vai là 1 người chuyên gia về viết SEO và cũng là một chuyên gia am hiểu tường'
        + ' tận về các sản phẩm giày đá bóng. Đoạn giới thiệu có khả năng leo thứ hạng SEO cao,' 
        + 'không lặp từ, lời văn giống con người 100%, lưu loát, có ngắt đoạn.'
        + 'Viết một bài blog giới thiệu về sự kiện tung voucher giảm giá của shop với mô tả sự kiện: ' + value.description
        + '. Với mã code là ' + value.code;
        let content = ''
        console.log("truoc do")
        await chatgpt.chatWithGPT(query).then(data => {content = data}).catch(e => {console.log(e.message); return e.message})
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
        try {
            console.log(1)
            await loginToWordpress(driver, url, username, password);
            await createNewPost(driver, title, content);
            
        } catch (e) {
            await driver.quit();
            return res.send(e.message);
        }finally {
            await new Promise(resolve => setTimeout(resolve, 5000));

            return res.send('success')
        }
    }
}

module.exports = new AutomationController();



