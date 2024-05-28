const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: "erp.nhacungcap1@gmail.com", // email của bên gửi
    pass: process.env.PASSWORD
    }
});


class emailController {
    async sendBill(req, res) {        
        const compile = async (data) => {
            const filePath = path.join(process.cwd(), './src/template', `index.hbs`);
            const html = await fs.readFile(filePath, 'utf8');
            const template = hbs.compile(html);
            return template(data);
        };
        
        hbs.registerHelper('dateFormat', (value, format) => {
            return moment(value).format(format);
        });
        try {
            const products = req.body.line_items;
            const data = 
            {
                bill: req.body.shipping,
                invoice_code: `Order #${req.body.id}`,
                created_at: req.body.created_at,
                products: products,
                total_price: req.body.total,
            };
            // console.log(data.bill.first_name)
            const browser = await puppeteer.launch({
                headless:true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                  ],
              });
            const page = await browser.newPage();
        
            const content = await compile(data);
            const billName = `invoice-${Date.now()}.pdf`
            await page.setContent(content);
            await page.emulateMediaType('screen');
            await page.pdf({
                path: `src/bill/${billName}`,
                format: 'A4',
                printBackground: true
            });
            console.log(process.env.PASSWORD)
            console.log('Hoàn thành');
            await browser.close();
            const email = req.body.billing.email;
            const mailOptions = {
                from: 'ERP.nhacungcap1@gmail.com', // đại chỉ bên gửi
                to: email ,// địa chỉ bên nhận
                subject: 'Xác nhận quy trình',
                text: 'Kính gửi quý khách hàng,' + '\n'
                    + `Chúng tôi là cửa hàng giày bóng đá HL store. \n`
                    + "Chúng tôi cảm ơn quý khách hàng vì đã quan tâm và ủng hộ sản phẩm của chúng tôi " + "\n"
                    + "\n"
                    + "Chúng tôi xin gửi ông/bà hóa đơn của đơn hàng này. \n"
                    + "Cảm ơn quý khách đã đọc đã xem. \n"
                    + "Người gửi,\n"
                    + `\tHL Store`,
                attachments: [{
                    filename: billName,
                    path: `src/bill/${billName}`,
                    contentType: 'application/pdf'
                    }],
            }; //nội dung email
        
            transporter.sendMail(mailOptions,async function(error, info) {
                if (error) {
                    console.log(error);
                    return res.send("error" + error.message); 
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.json('success')
                }
            })
            
        } catch (error) {
            console.log('Gặp lỗi:', error);
            res.send(error.message);
        }
        
    }

}

module.exports = new emailController();