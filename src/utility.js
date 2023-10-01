function assertWarn(condition, message, callback) {
	if (!condition) {
		console.warn(message);
		if (callback) callback();
	}
}

module.exports = {
    assertWarn: assertWarn,
};