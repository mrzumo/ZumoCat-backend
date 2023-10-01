const Mongoose = require("mongoose");

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
const CatModel = Mongoose.model("Cat", CatSchema);

module.exports = {
    CatModel: CatModel,
    InitMongo: async function () {
        await Mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    
        console.log("[Server] Connected to mongodb");
    },
};