const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const axios = require("axios");

const CUSTOMERS = 'customers', PRODUCTS = 'products', CATEGORIES = 'products/categories', ORDERS = 'orders', POSTS = `/posts?consumer_key=${process.env.KEY}&consumer_secret=${process.env.SECRET}`;;

// initialize woocommerce
const woo = new WooCommerceRestApi({
    url: 'https://webbanpod.topwebsite.vn',
    consumerKey: process.env.KEY,
    consumerSecret: process.env.SECRET,
    version: 'wc/v3',
    queryStringAuth: true
});

exports.getProducts = async (options = {}) => await woo.get(PRODUCTS, options);

exports.createVariant = async (data = {},id) => await woo.post(`products/${id}/variations/batch`, data);

exports.createProduct = async (data = {}) => await woo.post(PRODUCTS, data);

exports.deleteProduct = async (productId) => await woo.delete(`${PRODUCTS}/${productId}`);

exports.updateProduct = async (productId, data) => await woo.put(`${PRODUCTS}/${productId}`, data);

exports.getProduct = async (productId) => await woo.get(`${PRODUCTS}/${productId}`);

exports.createCategory = async (data = {}) => await woo.post(CATEGORIES, data);

exports.getCategory = async () => await woo.get(CATEGORIES);

exports.getCustomers = async () => await woo.get(CUSTOMERS);

exports.createCustomer = async (data = {}) => await woo.post(CUSTOMERS, data);

exports.updateOrder = async (id, data = {}) => await woo.put(`${ORDERS}/${id}`, data);
const wordpressApi = axios.create({
    baseURL: 'https://webbanpod.topwebsite.vn/wp-json/wp/v2',
});
exports.createPost = async (data = {}) => {
    try {
        const response = await wordpressApi.post(POSTS, data);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error.response?.data || error.message);
        throw error;
    }
};