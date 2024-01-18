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
	const value = defaultValue
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
	defaults,
	breakpoint = 'general'
) => {
	const zones = defaults
		? {
				0: defaults[0],
				50: defaults[1],
				100: defaults[2],
		  }
		: undefined;
	console.log(zones, type, attr);
	generateAttr(type, `${attr}-zones`, 'object', zones, breakpoint);

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
			generateUniqueAttributes(type, 'offset', [-400, 0, 400]);
		}

		if (type === 'horizontal') {
			generateUniqueAttributes(type, 'offset', [-200, 0, 200]);
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
			generateAttr(type, 'status', 'boolean', undefined, breakpoint);
			generateAttr(type, 'easing', 'string', undefined, breakpoint);
			generateAttr(type, 'speed', 'number', undefined, breakpoint);

			generateAttr(type, 'viewport-top', 'number', undefined, breakpoint);

			generateAttr(type, 'status', 'boolean', undefined, breakpoint);

			if (['vertical', 'horizontal'].includes(type)) {
				generateUniqueAttributes(type, 'offset', undefined, breakpoint);
			}

			if (type === 'rotate') {
				generateUniqueAttributes(type, 'rotate', undefined, breakpoint);
			}

			if (type === 'scale') {
				generateUniqueAttributes(type, 'scale', undefined, breakpoint);
			}

			if (type === 'fade') {
				generateUniqueAttributes(
					type,
					'opacity',
					undefined,
					breakpoint
				);
			}

			if (type === 'blur') {
				generateUniqueAttributes(type, 'blur', undefined, breakpoint);
			}
		});
	});

	return response;
})();

export default scroll;
