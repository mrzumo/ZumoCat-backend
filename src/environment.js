import Logger from "./logger.js";
import dotenv from "dotenv";

export const environment = process.env.NODE_ENV;


if (environment == "development") {
	dotenv.config({ path: ".env.dev" });
} else if (environment == "production") {
	dotenv.config({ path: ".env.prod" });
} else {
	Logger.error(`[Server] Invalid environment: ${environment}`);
	process.exit(1);
}

