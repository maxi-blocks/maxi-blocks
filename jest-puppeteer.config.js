/**
 * Puppeteer configuration for Ubuntu sandbox issues
 * This file is automatically picked up by @wordpress/scripts
 */
module.exports = {
	launch: {
		// Set headless based on environment variables
		headless:
			process.env.PUPPETEER_HEADLESS !== 'false' &&
			process.env.CI !== 'false',
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-accelerated-2d-canvas',
			'--no-first-run',
			'--no-zygote',
			'--single-process',
			'--disable-gpu',
		],
	},
};
