export const isLocalPreviewDebugHost = win => {
	const hostname = win?.location?.hostname;
	const userAgent = win?.navigator?.userAgent || '';
	const isTestEnvironment =
		typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

	if (
		userAgent.toLowerCase().includes('jsdom') ||
		(isTestEnvironment && win?.maxiIBAllowLocalDebugInTests !== true)
	)
		return false;

	return ['localhost', '127.0.0.1', '::1'].includes(hostname);
};

export const isPreviewDebugEnabled = (
	targetWindow = typeof window !== 'undefined' ? window : null
) => {
	const windowsToCheck = [
		targetWindow,
		typeof window !== 'undefined' ? window : null,
	].filter(Boolean);

	return windowsToCheck.some(win => {
		try {
			return (
				win.maxiIBDebug === true ||
				win.localStorage?.getItem?.('maxiIBDebug') === 'true'
			);
		} catch (error) {
			return false;
		}
	});
};

export const isPreviewDeepDebugEnabled = (
	targetWindow = typeof window !== 'undefined' ? window : null
) => {
	const windowsToCheck = [
		targetWindow,
		typeof window !== 'undefined' ? window : null,
	].filter(Boolean);

	return windowsToCheck.some(win => {
		try {
			const searchParams = new URLSearchParams(
				win.location?.search || ''
			);

			return (
				win.maxiIBDebugDeep === true ||
				win.maxiIBDebug === 'deep' ||
				['1', 'true'].includes(
					searchParams.get('maxiIBDebugDeep')
				) ||
				win.localStorage?.getItem?.('maxiIBDebugDeep') === 'true' ||
				win.localStorage?.getItem?.('maxiIBDebug') === 'deep'
			);
		} catch (error) {
			return false;
		}
	});
};

export const stringifyPreviewDebugDetails = details => {
	const seen = new WeakSet();

	try {
		return JSON.stringify(
			details,
			(key, value) => {
				if (typeof value === 'function') return '[Function]';
				if (typeof value === 'object' && value !== null) {
					if (seen.has(value)) return '[Circular]';
					seen.add(value);
				}

				return value;
			},
			2
		);
	} catch (error) {
		return JSON.stringify({
			error: error?.message || String(error),
			fallback: String(details),
		});
	}
};

export const debugPreview = (
	event,
	details = {},
	targetWindow = typeof window !== 'undefined' ? window : null,
	{ autoLocal = false, deep = false } = {}
) => {
	if (deep) {
		if (!isPreviewDeepDebugEnabled(targetWindow)) return;
	} else if (
		!isPreviewDebugEnabled(targetWindow) &&
		!(
			autoLocal &&
			[targetWindow, typeof window !== 'undefined' ? window : null]
				.filter(Boolean)
				.some(isLocalPreviewDebugHost)
		)
	)
		return;

	const loggers = [
		targetWindow?.console,
		typeof window !== 'undefined' ? window.console : null,
		typeof console !== 'undefined' ? console : null,
	].filter(Boolean);
	const uniqueLoggers = Array.from(new Set(loggers));

	uniqueLoggers.forEach(logger => {
		const log = logger.warn || logger.info;

		if (!log) return;

		// eslint-disable-next-line no-console
		log(
			deep ? '[Maxi IB Preview Deep]' : '[Maxi IB Preview]',
			event,
			deep ? stringifyPreviewDebugDetails(details) : details
		);

		if (!deep)
			// eslint-disable-next-line no-console
			log(
				'[Maxi IB Preview JSON]',
				event,
				stringifyPreviewDebugDetails(details)
			);
	});
};
