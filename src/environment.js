import Logger from "./logger.js";
import dotenv from "dotenv";

export const environment = process.env.NODE_ENV;


switch (environment) {
	case "development":
		dotenv.config({ path: ".env.dev" });
		break;
	case "production":
		dotenv.config({ path: ".env.prod" });
		break;
	default:
		Logger.error(`[Server] Invalid environment: ${environment}`);
		process.exit(1);
}

