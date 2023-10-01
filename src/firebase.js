const { getStorage, ref, uploadBytes } = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const { assertWarn } = require("./utility.js");
const { CatModel } = require("./mongoose.js");

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

	let cat = new CatModel({
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

module.exports = {
	uploadImage: uploadImage,
	storage: storage,
};
