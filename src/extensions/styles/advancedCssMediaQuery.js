export const ADVANCED_CSS_MEDIA_QUERY_SEPARATOR =
	'___MAXI_ADVANCED_CSS_MEDIA_QUERY___';

export const buildAdvancedCssMediaQueryTarget = (mediaQuery, selector) =>
	`${mediaQuery}${ADVANCED_CSS_MEDIA_QUERY_SEPARATOR}${selector}`;

export const isAdvancedCssMediaQueryTarget = target =>
	typeof target === 'string' &&
	target.includes(ADVANCED_CSS_MEDIA_QUERY_SEPARATOR);

export const splitAdvancedCssMediaQueryTarget = target => {
	const [mediaQuery, selector] = target.split(
		ADVANCED_CSS_MEDIA_QUERY_SEPARATOR
	);

	return { mediaQuery, selector };
};
