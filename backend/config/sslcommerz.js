// config/sslcommerz.js
const SSLCommerzConfig = {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASSWORD,
    is_live: process.env.SSL_MODE === 'live', // true or false
};

export default SSLCommerzConfig;
