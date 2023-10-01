const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const image = fs.readFileSync(path.join(__dirname, "./cat_example.jpeg"));

const form = new FormData();
form.append("image", image, "image.jpeg"); 

axios
	.post("http://localhost:80/upload", form, {
        headers: {
            title: "Test Image",
            description: "This is a test image",
            tags: JSON.stringify(["tag1", "tag2"]),

			Authorization: "123",
        },  

		...form.getHeaders(),
	})
	.then((res) => {
		console.log(res.data);
	})
	.catch((err) => {
		console.error(err);
	});




