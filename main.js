// -- Pre Init

import "./src/environment.js";

// -- Imports

import Logger from "./src/logger.js";
import { InitMongo } from "./src/mongoose.js";

import express from "express";
import request from "sync-request";
import busboy from "connect-busboy";
import cors from "cors";

// -- Constants --
const SERVER_PORT = parseInt(process.env.PORT) || 4040;
const IS_PRODUCTION = process.env.PRODUCTION == "true";

// -- Main --

const app = express();
app.use(busboy()); // Parse multipart/form-data
app.use(cors()); // Allow cross origin requests

// -- Routes --
import { requireAuth } from "./src/routes/auth.js";
const routes = {
	root: (await import("./src/routes/root.js")).default,
	upload: (await import("./src/routes/upload.js")).default,
	random: (await import("./src/routes/random.js")).default,
  };

app.get("/", routes.root);
app.get("/random", routes.random);
app.post("/upload", requireAuth, routes.upload);

// -- Init --

async function main() {
	await InitMongo(); // Connect to mongodb

	app.listen(SERVER_PORT, () => {
		let publicIp = request("GET", "https://api.ipify.org").getBody();
		let ipAddress = IS_PRODUCTION
			? `${publicIp}:${SERVER_PORT}`
			: `localhost:${SERVER_PORT}`; // show public ip if in production

		Logger.info(`[Server] Running on ${ipAddress}\n`);
	});
}

main();
