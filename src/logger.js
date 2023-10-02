import { ChalkColors } from "./constants.js";
import { createLogger, transports, format } from "winston";

import fs from "fs";
import chalk from "chalk";


// Delete previous logs
if (!fs.existsSync("logs")) {
	fs.mkdirSync("logs");
} else {
	let logs_exist =
		fs.existsSync("logs/error.log") &&
		fs.existsSync("logs/warn.log") &&
		fs.existsSync("logs/info.log") &&
		fs.existsSync("logs/combined.log");
	if (logs_exist) {
		fs.unlinkSync("logs/error.log");
		fs.unlinkSync("logs/warn.log");
		fs.unlinkSync("logs/info.log");
		fs.unlinkSync("logs/combined.log");
	}
}

const colorReplace = {
	"[Server]": ChalkColors.blue("[Server]"),
	"[+]": ChalkColors.green("[+]"),
	"[!]": ChalkColors.red("[!]"),

	"Environment Variables:": chalk.bold("Environment Variables:"),
	"Port:": chalk.bold("Port:"),
	"Production:": chalk.bold("Production:"),
	"Rate Limit:": chalk.bold("Rate Limit:"),
	"Max:": chalk.bold("Max:"),
	"Delay:": chalk.bold("Delay:"),
}

const fileFormat = format.combine(
	format.timestamp({
		format: "YYYY-MM-DD HH:mm:ss",
	}),
	format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const consoleFormat = format.combine(
	format.colorize({}),
	format.timestamp({
		format: "YYYY-MM-DD HH:mm:ss",
	}),
	format.printf((info) => {
		for (const [key, value] of Object.entries(colorReplace)) {
			info.message = info.message.replace(key, value);
		}

		for (const word of info.message.split(" ")) { // replace all numbers and booleans with purple
			if (!isNaN(word) || word == "true" || word == "false") {
				info.message = info.message.replace(word, ChalkColors.purple(word));
			}
		}

		return `${ChalkColors.dim(info.timestamp)} ${info.level}: ${info.message}`;
	})
);

const logger = createLogger({
	level: "info",
	format: fileFormat,
	transports: [
		new transports.File({ filename: "logs/error.log", level: "error" }),
		new transports.File({ filename: "logs/warn.log", level: "warn" }),
		new transports.File({ filename: "logs/info.log", level: "info" }),
		new transports.File({ filename: "logs/combined.log" }),
		new transports.Console({
			format: consoleFormat,
		}),
	],
});

export default logger;
