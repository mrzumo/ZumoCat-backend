import Mongoose from "mongoose";
import Logger from "./logger.js";

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
	await Mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	Logger.info("[Server] Connected to mongodb");
}
