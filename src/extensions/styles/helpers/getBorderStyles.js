import getLastBreakpointAttribute from '..//getLastBreakpointValue';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getBorderStyles = obj => {
	const keyWords = ['top', 'right', 'bottom', 'left'];

	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		Object.entries(obj).forEach(([key, value]) => {
			const includesBreakpoint =
				key.lastIndexOf(`-${breakpoint}`) + `-${breakpoint}`.length ===
				key.length;

			if (
				!!value &&
				includesBreakpoint &&
				!key.includes('sync') &&
				!key.includes('unit')
			) {
				const replacer = new RegExp(
					`\\b-${breakpoint}\\b(?!.*\\b-${breakpoint}\\b)`,
					'gm'
				);
				const newLabel = key.replace(replacer, '');

				if (!keyWords.some(key => newLabel.includes(key)))
					response[breakpoint][newLabel] = `${value}`;
				else {
					const unitKey = keyWords.filter(key =>
						newLabel.includes(key)
					);
					const unit = getLastBreakpointAttribute(
						`${newLabel.replace(unitKey, 'unit')}`,
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

export default getBorderStyles;
