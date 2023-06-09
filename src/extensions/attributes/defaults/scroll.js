export const scrollTypes = [
	['vertical', '_v'],
	['horizontal', '_ho'],
	['rotate', '_rot'],
	['scale', '_sc'],
	['fade', '_fa'],
	['blur', '_blu'],
];

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

const response = {
	_sef: {
		type: 'number',
		default: 0,
		longLabel: 'shortcutEffect',
	},
	_set: {
		type: 'object',
		longLabel: 'shortcutEffectType',
	},
};

const generateAttr = (
	scrollType,
	attr,
	shortAttr,
	valueType = 'number',
	defaultValue,
	breakpoint = 'g'
) => {
	const key = `scroll-${scrollType[0]}-${attr}-${
		breakpoint === 'g' ? 'general' : breakpoint
	}`;
	const shortKey = `sc${scrollType[1]}${shortAttr}-${breakpoint}`;

	const value =
		defaultValue !== 'noDefault'
			? {
					type: valueType,
					default: defaultValue,
			  }
			: {
					type: valueType,
			  };

	response[shortKey] = { ...value, longLabel: key };

	return null;
};

const generateUniqueAttributes = (
	type,
	attr,
	shortAttr,
	defaults = [0, 0, 0],
	breakpoint = 'g'
) => {
	generateAttr(
		type,
		`${attr}-start`,
		`${shortAttr}_sta`,
		'number',
		defaults[0],
		breakpoint
	);
	generateAttr(
		type,
		`${attr}-mid`,
		`${shortAttr}.m`,
		'number',
		defaults[1],
		breakpoint
	);
	generateAttr(
		type,
		`${attr}-end`,
		`${shortAttr}_e`,
		'number',
		defaults[2],
		breakpoint
	);

	return null;
};

export const scroll = (() => {
	Object.values(scrollTypes).forEach(type => {
		generateAttr(type, 'status', '.s', 'boolean', false);
		generateAttr(type, 'preview-status', '.ps', 'boolean', false);
		generateAttr(type, 'easing', '_ea', 'string', 'ease');
		generateAttr(type, 'speed', '_spe', 'number', 500);
		generateAttr(type, 'delay', '_de', 'number', 0);
		generateAttr(type, 'viewport-top', '_vpt', 'string', 'mid'); // 100
		generateAttr(type, 'status-reverse', '_sr', 'boolean', true);

		if (type[0] === 'vertical') {
			generateUniqueAttributes(type, 'offset', '_of', [-400, 0, 400]);
		}

		if (type[0] === 'horizontal') {
			generateUniqueAttributes(type, 'offset', '_of', [-200, 0, 200]);
		}

		if (type[0] === 'rotate') {
			generateUniqueAttributes(type, 'rotate', '_rot', [90, 0, 0]);
		}

		if (type[0] === 'scale') {
			generateUniqueAttributes(type, 'scale', '_sc', [70, 100, 100]);
		}

		if (type[0] === 'fade') {
			generateUniqueAttributes(type, 'opacity', '_o', [0, 100, 100]);
		}

		if (type[0] === 'blur') {
			generateUniqueAttributes(type, 'blur', '_blu', [10, 0, 0]);
		}
	});

	Object.values(breakpoints).forEach(breakpoint => {
		Object.values(scrollTypes).forEach(type => {
			generateAttr(
				type,
				'status',
				'.s',
				'boolean',
				'noDefault',
				breakpoint
			);
			generateAttr(
				type,
				'easing',
				'_ea',
				'string',
				'noDefault',
				breakpoint
			);
			generateAttr(
				type,
				'speed',
				'_spe',
				'number',
				'noDefault',
				breakpoint
			);

			generateAttr(
				type,
				'viewport-top',
				'_vpt',
				'number',
				'noDefault',
				breakpoint
			);

			if (type[0] === 'vertical' || type[0] === 'horizontal') {
				generateUniqueAttributes(
					type,
					'offset',
					'_of',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type[0] === 'rotate') {
				generateUniqueAttributes(
					type,
					'rotate',
					'_rot',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type[0] === 'scale') {
				generateUniqueAttributes(
					type,
					'scale',
					'_sc',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type[0] === 'fade') {
				generateUniqueAttributes(
					type,
					'opacity',
					'_o',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}

			if (type[0] === 'blur') {
				generateUniqueAttributes(
					type,
					'blur',
					'_blu',
					['noDefault', 'noDefault', 'noDefault'],
					breakpoint
				);
			}
		});
	});

	return response;
})();

export default scroll;
