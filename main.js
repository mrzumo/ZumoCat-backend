
// -- Imports

const express = require("express");
const busboy = require("connect-busboy");
const request = require("sync-request");
const path = require("path");
const cors = require("cors");

const Mongoose = require("mongoose");
const {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");

// -- Constants --
const dotenv = require("dotenv");
const environment = process.env.NODE_ENV || "development";

console.log(`[Server] Running in ${environment} mode`);

if (environment == "development") {
	dotenv.config({ path: ".env.dev" })
} else {
	dotenv.config({ path: ".env.prod" })
}

const port = parseInt(process.env.PORT) || 4040;
const is_production = (process.env.PRODUCTION == "true");

const app = express();
app.use(busboy());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URI = process.env.MONGO_URI;

function assertWarn(condition, message, callback) {
	if (!condition) {
		console.warn(message);
		if (callback) callback();
	}
}

// -- Mongoose --



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
console.log("[Server] Connected to firebase");

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
			cat.save().then(() => {
				console.log("[+] Saved image data to database\n");
			}); // only save to db if upload was successful
		})
		.catch((error) => {
			console.warn("[!] Error uploading image:", error);
		});
}

app.get("/", (_req, res) => {
	res.status(200).send("Server Running");
});

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
		url: url,
	});
});



async function main() {
	await Mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})

	console.log("[Server] Connected to mongodb");

	app.listen(port, () => {
		let publicIp = request("GET", "https://api.ipify.org").getBody();
		let ipAddress = is_production ? `${publicIp}:${port}` : `localhost:${port}`;
	
		console.log(`[Server] running on ${ipAddress}\n`);
	});
}

main();