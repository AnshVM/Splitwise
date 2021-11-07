const axios = require('axios');
const url = "http://localhost:5000/api/user"
const fs = require('fs')


for (let i = 1; i <= 10; i++) {
    const body = {
        firstname:"user",
        lastname:i,
        username: "user" + i,
        email: "user" + i + "@xmail.com",
        password: "user" + i
    }
    axios.post(url, body)
        .then(function (response) {
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
}