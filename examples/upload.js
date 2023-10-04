import fs from "fs";
import axios from "axios";
import FormData from "form-data";

const image = fs.readFileSync("./cat_example.jpeg");

const form = new FormData();
form.append("image", image, "image.jpeg"); 

axios
	.post("https://api.com/upload", form, {
        headers: {
            title: "Test Image",
            description: "This is a test image",
            tags: JSON.stringify(["tag1", "tag2"]),

			Authorization: "-",
        },  

		...form.getHeaders(),
	})
	.then((res) => {
		console.log(res.data);
	})
	.catch((err) => {
		console.error(err);
	});




