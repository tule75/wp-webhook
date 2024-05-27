const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const CUSTOMERS = 'customers', PRODUCTS = 'products', CATEGORIES = 'products/categories';

// initialize woocommerce
const woo = new WooCommerceRestApi({
    url: 'http://localhost/wp',
    consumerKey: 'ck_5a7055788c8a3e314014a3e3041b1dacd3918c80',
    consumerSecret: 'cs_af0aeb65aba8ccc5eeea6016147d6f6fc011497c',
    version: 'wc/v3',
    queryStringAuth: true
});

exports.getProducts = async (options = {}) => await woo.get(PRODUCTS, options);

exports.createProduct = async (data = {}) => await woo.post(PRODUCTS, data);

exports.deleteProduct = async (productId) => await woo.delete(`${PRODUCTS}/${productId}`);

exports.updateProduct = async (productId, data) => await woo.put(`${PRODUCTS}/${productId}`, data);

exports.getProduct = async (productId) => await woo.get(`${PRODUCTS}/${productId}`);

exports.createCategory = async (data = {}) => await woo.post(CATEGORIES, data);

exports.getCategory = async () => await woo.get(CATEGORIES);

exports.getCustomers = async () => await woo.get(CUSTOMERS);

exports.createCustomer = async (data = {}) => await woo.post(CUSTOMERS, data);