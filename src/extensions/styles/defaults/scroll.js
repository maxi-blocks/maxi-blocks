export const scrollTypes = [
	'vertical',
	'horizontal',
	'rotate',
	'scale',
	'fade',
	'blur',
];

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

const response = {
	shortcutEffect: {
		type: 'number',
		default: 0,
	},
	shortcutEffectType: {
		type: 'object',
	},
};

const generateAttr = (
	scrollType,
	attr,
	valueType = 'number',
	defaultValue,
	breakpoint = 'general'
) => {
	const key = `scroll-${scrollType}-${attr}-${breakpoint}`;
	const value =
		defaultValue !== 'noDefault'
			? {
					type: valueType,
					default: defaultValue,
			  }
			: {
					type: valueType,
			  };

	response[key] = value;

	return null;
};

const generateUniqueAttributes = (
	type,
	attr,
	defaults = [0, 0, 0],
	breakpoint = 'general'
) => {
	generateAttr(type, `${attr}-start`, 'number', defaults[0], breakpoint);
	generateAttr(type, `${attr}-mid`, 'number', defaults[1], breakpoint);
	generateAttr(type, `${attr}-end`, 'number', defaults[2], breakpoint);

	return null;
};

export const scroll = (() => {
	Object.values(scrollTypes).forEach(type => {
		generateAttr(type, 'status', 'boolean', false);
		generateAttr(type, 'preview-status', 'boolean', false);
		generateAttr(type, 'easing', 'string', 'ease');
		generateAttr(type, 'speed', 'number', 500);
		generateAttr(type, 'delay', 'number', 0);
		generateAttr(type, 'viewport-top', 'string', 'mid'); // 100
		generateAttr(type, 'status-reverse', 'boolean', true);

		if (type === 'vertical') {
			generateUniqueAttributes(type, 'vertical', [-400, 0, 400]);
		}

		if (type === 'horizontal') {
			generateUniqueAttributes(type, 'horizontal', [-200, 0, 200]);
		}

		if (type === 'rotate') {
			generateUniqueAttributes(type, 'rotate', [90, 0, 0]);
		}

		if (type === 'scale') {
			generateUniqueAttributes(type, 'scale', [70, 100, 100]);
		}

		if (type === 'fade') {
			generateUniqueAttributes(type, 'opacity', [0, 100, 100]);
		}

		if (type === 'blur') {
			generateUniqueAttributes(type, 'blur', [10, 0, 0]);
		}
	});

	Object.values(breakpoints).forEach(breakpoint => {
		Object.values(scrollTypes).forEach(type => {
			generateAttr(type, 'status', 'boolean', 'noDefault', breakpoint);
			generateAttr(type, 'easing', 'string', 'noDefault', breakpoint);
			generateAttr(type, 'speed', 'number', 'noDefault', breakpoint);

			generateAttr(
				type,
				'viewport-top',
				'number',
				'noDefault',
				breakpoint
			);

			generateAttr(type, 'status', 'boolean', 'noDefault', breakpoint);

			if (type === 'vertical') {
				generateUniqueAttributes(
					type,
					'vertical',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type === 'horizontal') {
				generateUniqueAttributes(
					type,
					'horizontal',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type === 'rotate') {
				generateUniqueAttributes(
					type,
					'rotate',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type === 'scale') {
				generateUniqueAttributes(
					type,
					'scale',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type === 'fade') {
				generateUniqueAttributes(
					type,
					'opacity',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type === 'blur') {
				generateUniqueAttributes(
					type,
					'blur',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}
		});
	});

	return response;
})();

export default scroll;
