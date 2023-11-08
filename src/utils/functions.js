import logger from "./logger.js";

export function assertWarn(condition, message, callback) {
	if (!condition) {
		logger.warn(message);
		if (callback) callback();
	}
}
