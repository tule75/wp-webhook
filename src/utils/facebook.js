const axios = require('axios');

exports.postToFacebook = async (message) => {
  console.log(process.env.FACEBOOK_ACCESS_KEY);
  return fetch(`https://graph.facebook.com/v21.0/${process.env.FACEBOOK_PAGE_ID}/feed`, {
    headers: {
      "Authorization": `Bearer ${process.env.FACEBOOK_ACCESS_KEY}`,
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      message: message,
      published: "true"
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Response data:", data);
      return "Success!";
    })
    .catch(err => {
      console.error("Error:", err);
      return "Fail with error: " + err.message;
    });
  
}

