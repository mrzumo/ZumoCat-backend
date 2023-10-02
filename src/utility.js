const logger = require("./logger");

function assertWarn(condition, message, callback) {
	if (!condition) {
		logger.warn(message);
		if (callback) callback();
	}
}

module.exports = {
	assertWarn: assertWarn,
};
