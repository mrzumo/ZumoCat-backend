import fs from "fs";
import { ChalkColors } from "./constants.js";
import { createLogger, transports, format } from "winston";

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
		info.message = info.message.replace("[Server]",	ChalkColors.blue("[Server]"));
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
