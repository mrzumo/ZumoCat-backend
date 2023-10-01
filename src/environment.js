const dotenv = require("dotenv");
const environment = process.env.NODE_ENV;

console.log(`[Server] Running in ${environment} mode`);

if (environment == "development") {
	dotenv.config({ path: ".env.dev" });
} else if (environment == "production") {
	dotenv.config({ path: ".env.prod" });
} else {
	console.error(`[Server] Invalid environment: ${environment}`);
	process.exit(1);
}
