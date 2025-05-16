module.exports = async function () {
	process.env.TZ = 'UTC'; // Need to set timezone in global setup before Date caches the timezone
};
