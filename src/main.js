// -- Pre Init

import { environment } from "./utils/environment.js";

// -- Imports

import Logger from "./utils/logger.js";
import { InitMongo } from "./utils/mongoose.js";
import { requireAuth } from "./routes/auth.js";

import cors from "cors";
import path from "path";
import express from "express";
import request from "sync-request";
import busboy from "connect-busboy";
import rateLimit from "express-rate-limit";

// -- Constants --

const env = process.env
const rootPath = path.resolve(path.dirname("."));

const SERVER_PORT = parseInt(env.PORT) || 4040;
const IS_PRODUCTION = env.PRODUCTION == "true" || false;

const RATE_LIMIT_MAX = parseInt(env.RATE_LIMIT_MAX) || 100;
const RATE_LIMIT_DELAY = parseInt(env.RATE_LIMIT_DELAY) || 60 * 5000;

global.ROOT_PATH = rootPath;

Logger.info("Environment Variables: ")
Logger.info(`	Port: ${SERVER_PORT}`)
Logger.info(`	Production: ${IS_PRODUCTION}`)
Logger.info(`	Rate Limit:`)
Logger.info(`		Max: ${RATE_LIMIT_MAX}`)
Logger.info(`		Delay: ${RATE_LIMIT_DELAY}\n`)

Logger.info(`[Server] Running in ${environment} mode`);

// -- Main --

const app = express();

app.use(busboy()) // Parse multipart/form-data
app.use(cors()) // Allow cross origin requests

app.use(express.json({limit: '8mb'}));
app.use(express.urlencoded({limit: '8mb', extended: true }));

// -- Routes --

const rateLimiter = rateLimit({
	windowMs: 60 * 5000, // 5 minute
	max: 100, // 100 requests per 5 minutes
	handler: (_req, res) => {
		res.status(429).send(
			JSON.stringify({ code: 429, message: "Too many requests" })
		);
	},
});

const routes = {
	root: (await import("./routes/root.js")).default,
	upload: (await import("./routes/upload.js")).default,
	random: (await import("./routes/random.js")).default,
	getLatest: (await import("./routes/latest.js")).default,
};

app.get("/", routes.root);
app.get("/random", rateLimiter, routes.random);
app.get("/latest", rateLimiter, routes.getLatest);
app.post("/upload", requireAuth, routes.upload);

// -- Init --

async function main() {
	await InitMongo(); // Connect to mongodb

	app.listen(SERVER_PORT, () => {
		let publicIp = request("GET", "https://api.ipify.org").getBody()
		let ipAddress = IS_PRODUCTION
			? `${publicIp}:${SERVER_PORT}` // Display public ip if in production
			: `localhost:${SERVER_PORT}`; // Display localhost if in development

		Logger.info(`[Server] Running on ${ipAddress}\n`);
	});
}

main();
