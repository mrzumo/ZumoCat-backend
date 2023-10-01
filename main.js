// -- Pre Init

require("./src/environment.js")


// -- Imports

const { InitMongo } = require("./src/mongoose.js");

const express = require("express");
const request = require("sync-request");
const busboy = require("connect-busboy");
const cors = require("cors");

// -- Constants --
const SERVER_PORT = parseInt(process.env.PORT) || 4040;
const IS_PRODUCTION = (process.env.PRODUCTION == "true");

// -- Main --

const app = express();
app.use(busboy()); // Parse multipart/form-data
app.use(cors()); // Allow cross origin requests

// -- Routes --

const routes = {
	root: require("./src/routes/root.js"),
	upload: require("./src/routes/upload.js"),
	random: require("./src/routes/random.js"),
}

app.get("/", routes.root);
app.get("/random", routes.random);
app.post("/upload", routes.upload);

// -- Init --

async function main() {
	await InitMongo(); // Connect to mongodb

	app.listen(SERVER_PORT, () => {
		let publicIp = request("GET", "https://api.ipify.org").getBody();
		let ipAddress = IS_PRODUCTION ? `${publicIp}:${SERVER_PORT}` : `localhost:${SERVER_PORT}`; // show public ip if in production
	
		console.log(`[Server] Running on ${ipAddress}\n`);
	});
}

main();