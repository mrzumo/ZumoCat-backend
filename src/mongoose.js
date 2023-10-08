import Mongoose from "mongoose";
import Logger from "./logger.js";
import { storage } from "./firebase.js";
import { ref, getDownloadURL } from "firebase/storage";

const MONGO_URI = process.env.MONGO_URI;

const CatSchema = new Mongoose.Schema(
	{
		title: String,
		description: String,
		tags: [String],
		filePath: String,
		uploadTime: Number,
	},
	{ collection: "Cats" }
);
export const CatModel = Mongoose.model("Cat", CatSchema);

export async function InitMongo() {
	try {
		await Mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (error) {
		Logger.error(`[Server] Failed to connect to mongodb: ${error}`);
		process.exit(1);
	}

	Logger.info("[Server] Connected to mongodb");
}

export async function getModelJson(model) {
	let refrence = ref(storage, model.filePath);
	let url = await getDownloadURL(refrence);

	return {
		title: model.title,
		description: model.description,
		tags: model.tags,
		url: url,
	};
}
