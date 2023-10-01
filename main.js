require("dotenv").config();

// -- Imports

const express = require("express");
const busboy = require("connect-busboy");

const fs = require("fs");
const path = require("path");

const Mongoose = require("mongoose");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { initializeApp } = require("firebase/app");

// -- Constants --
const port = 80;

const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URI = process.env.MONGO_URI;

function assertWarn(condition, message, callback) {
	if (!condition) {
		console.warn(message);
		if (callback) callback();
	}
}

// -- Mongoose --

Mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const catSchema = new Mongoose.Schema(
	{
		title: String,
        description: String,
        tags: [String],

		filePath: String,
		uploadTime: Number,
	},
	{ collection: "Cats" }
);

const Cat = Mongoose.model("Cat", catSchema);

// -- Firebase --

initializeApp({
	storageBucket: "zumocat-78816.appspot.com",
});

const storage = getStorage();

function uploadImage(fileData, fileExtention, catData) {
	/*
        CatData: {
            title: String,
            description: String,
            tags: [String]
        }
    */
	assertWarn(
		catData.title,
		"No title provided for image, using default",
		() => (catData.title = "Untitled")
	);
	assertWarn(
		catData.description,
		"No description provided for image, using default",
		() => (catData.description = "No Description")
	);
	assertWarn(
		catData.tags,
		"No tags provided for image, using default",
		() => (catData.tags = [])
	);

	let uploadTime = Date.now();
	let filePath = `${uploadTime}.${fileExtention}`;

	console.log(
		`Uploading image: ${filePath} with ${JSON.stringify(catData, null, 4)}`
	);

	let cat = new Cat({
		filePath: filePath,
		uploadTime: uploadTime,

		title: catData.title,
		description: catData.description,
		tags: catData.tags,
	});

	const storageRef = ref(storage, cat.filePath); // {date}.{ext}

	uploadBytes(storageRef, fileData)
		.then((_snapshot) => {
			console.log("[+] Uploaded image to firebase");
			cat.save(); // only save to db if upload was successful
			console.log("[+] Saved image data to database");
		})
		.catch((error) => {
			console.warn("[!] Error uploading image:", error);
		});
}

app.get("/" , (_req, res) => {
	res.status(200).send("Server Running")
})

app.route("/upload").post(function (req, res, _next) {
	req.pipe(req.busboy);
	req.busboy.on("file", function (_fileName, fileStream, fileMetadata) {
		const [fileName, fileExt] = fileMetadata.filename.split(".");

		const imageBuffer = [];
		fileStream.on("data", function (data) {
			imageBuffer.push(data);
		});

		fileStream.on("end", function () {
			let tags;
			if (req.headers.tags) {
				try {
					tags = JSON.parse(req.headers.tags);
				} catch (e) {
					return res.status(400).send("Invalid tag header");
				}
			} else {
				tags = [];
			}

			const catData = {
				title: req.headers.title,
				description: req.headers.description,
				tags: tags,
			};

			uploadImage(Buffer.concat(imageBuffer), fileExt, catData);
			res.status(200).send("Uploaded image");
		});
	});
});

app.get("/random", async (_req, res) => {
    let cats = await Cat.find({});
    let randomCat = cats[Math.floor(Math.random() * cats.length)];

    let refrence = ref(storage, randomCat.filePath);
    let url = await getDownloadURL(refrence);

    res.status(200).send({
        title: randomCat.title,
        description: randomCat.description,
        tags: randomCat.tags,
        url: url
    });
})

app.listen(port, () => {
	console.log(`[Server] - running on port ${port}`);
});
