const axios = require('axios');
exports.getAcessToken = async function () {
    let data = {
        "app_id": "cli_a5fda5d27138502f",
        "app_secret": "UUF5ku27wbxk2QpW0CUjEbdqLIbzMLZV"
    };
    await axios.post('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', data)
    .then(async (data) => {
        return data.data.app_access_token;
    }).catch(async (err) => {
        return err.message
    })
}
