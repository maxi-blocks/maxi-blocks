/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

// Cache for font URLs and active timers
const fontUrlCache = new Map();
const pendingRequests = new Map();
const activeTimers = new Set();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const originalApiFetch = apiFetch;
const wrappedApiFetch = async options => {
	const startTime = Date.now();
	console.log(`API Fetch: Starting request to ${options.path}`);

	// Check cache first
	const cacheKey = options.path;
	const cached = fontUrlCache.get(cacheKey);
	if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
		console.log(`Using cached response for ${options.path}`);
		return cached.data;
	}

	try {
		const response = await originalApiFetch(options);
		const duration = Date.now() - startTime;
		console.log(
			`API Fetch: Request to ${options.path} completed in ${duration}ms`,
			duration > 1000 ? '⚠️ Slow request!' : ''
		);

		// Cache the response
		fontUrlCache.set(cacheKey, {
			data: response,
			timestamp: Date.now()
		});

		return response;
	} catch (error) {
		console.error(
			`API Fetch: Request to ${options.path} failed after ${
				Date.now() - startTime
			}ms`,
			error
		);
		throw error;
	}
};

const safeConsoleTime = (label) => {
	if (!activeTimers.has(label)) {
		console.time(label);
		activeTimers.add(label);
	}
};

const safeConsoleTimeEnd = (label) => {
	if (activeTimers.has(label)) {
		console.timeEnd(label);
		activeTimers.delete(label);
	}
};

const resolvers = {
	getFontUrl:
		(fontName, fontData) =>
		async ({ dispatch }) => {
			const requestKey = `${fontName}-${JSON.stringify(fontData)}`;
			const timerLabel = `resolver-getFontUrl-${fontName}`;

			if (pendingRequests.has(requestKey)) {
				console.log(`Using pending request for ${fontName}`);
				return pendingRequests.get(requestKey);
			}

			safeConsoleTime(`${timerLabel}-total`);
			console.log(`Starting font URL fetch for: ${fontName}`);

			const promise = (async () => {
				safeConsoleTime(`${timerLabel}-encode`);
				const encodedFontName = encodeURIComponent(fontName).replace(
					/%20/g,
					'+'
				);
				safeConsoleTimeEnd(`${timerLabel}-encode`);

				safeConsoleTime(`${timerLabel}-apiFetch`);
				let fontUrl;
				try {
					fontUrl = await wrappedApiFetch({
						path: `/maxi-blocks/v1.0/get-font-url/${encodedFontName}`,
						method: 'GET',
					});
					console.log(`API Response received for ${fontName}:`, fontUrl);
				} catch (error) {
					console.error(
						`Error in getFontUrl resolver for ${fontName}:`,
						error
					);
					throw error;
				} finally {
					pendingRequests.delete(requestKey);
				}
				safeConsoleTimeEnd(`${timerLabel}-apiFetch`);

				safeConsoleTime(`${timerLabel}-dispatch`);
				const result = dispatch.setFontUrl(fontName, fontData, fontUrl);
				safeConsoleTimeEnd(`${timerLabel}-dispatch`);

				safeConsoleTimeEnd(`${timerLabel}-total`);
				return result;
			})();

			pendingRequests.set(requestKey, promise);
			return promise;
		},
};

export default resolvers;
