import Logger from "./logger.js";
import dotenv from "dotenv";


const environment = process.env.NODE_ENV;

Logger.info(`[Server] Running in ${environment} mode`);

if (environment == "development") {
	dotenv.config({ path: ".env.dev" });
} else if (environment == "production") {
	dotenv.config({ path: ".env.prod" });
} else {
	Logger.error(`[Server] Invalid environment: ${environment}`);
	process.exit(1);
}
