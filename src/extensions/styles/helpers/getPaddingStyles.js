/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointValue';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getPaddingStyles = (obj, prefix) => {
	const keyWords = ['top', 'right', 'bottom', 'left'];

	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		Object.entries(obj).forEach(([key, value]) => {
			const newKey = prefix ? key.replace(prefix, '') : key;

			const includesBreakpoint =
				newKey.lastIndexOf(`-${breakpoint}`) +
					`-${breakpoint}`.length ===
				newKey.length;

			if (
				!!value &&
				includesBreakpoint &&
				!newKey.includes('sync') &&
				!newKey.includes('unit')
			) {
				const replacer = new RegExp(
					`\\b-${breakpoint}\\b(?!.*\\b-${breakpoint}\\b)`,
					'gm'
				);
				const newLabel = newKey.replace(replacer, '');

				if (!keyWords.some(key => newLabel.includes(key)))
					response[breakpoint][newLabel] = `${value}`;
				else {
					const unitKey = keyWords.filter(key =>
						newLabel.includes(key)
					);

					const unit = getLastBreakpointAttribute(
						`${prefix ? prefix : ''}${newLabel.replace(
							unitKey,
							'unit'
						)}`,
						breakpoint,
						obj
					);

					response[breakpoint][newLabel] = `${value}${unit}`;
				}
			}
		});
	});

	return response;
};

export default getPaddingStyles;
