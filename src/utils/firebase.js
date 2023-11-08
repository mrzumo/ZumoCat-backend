import { getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { assertWarn } from "./functions.js";
import { CatModel } from "./mongoose.js";
import Logger from "./logger.js";

initializeApp({
	storageBucket: "zumocat-78816.appspot.com",
});
Logger.info("[Server] Connected to firebase");

export const storage = getStorage();

export function uploadImage(fileData, fileExtention, catData) {
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

	Logger.info(
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
			Logger.info("[+] Uploaded image to firebase");
			cat.save().then(() => {
				Logger.info("[+] Saved image data to database\n");
			}); // only save to db if upload was successful
		})
		.catch((error) => {
			Logger.error("[!] Error uploading image:", error);
		});
}
