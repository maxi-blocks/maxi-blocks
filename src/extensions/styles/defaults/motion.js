const motionTypes = [
	'vertical',
	'horizontal',
	'rotate',
	'scale',
	'fade',
	'blur',
];

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

const response = {
	'motion-active-general': {
		type: 'string',
	},
	'motion-preset-status-general': {
		type: 'boolean',
		default: false,
	},
	'motion-preview-status-general': {
		type: 'boolean',
		default: false,
	},
};

const generateAttr = (
	motionType,
	attr,
	valueType = 'number',
	defaultValue,
	breakpoint = 'general'
) => {
	const key = `motion-${attr}-${motionType}-${breakpoint}`;
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
	generateAttr(type, `${attr}-middle`, 'number', defaults[1], breakpoint);
	generateAttr(type, `${attr}-end`, 'number', defaults[2], breakpoint);

	return null;
};

export const motion = (() => {
	Object.values(motionTypes).forEach(type => {
		generateAttr(type, 'status', 'boolean', false);
		generateAttr(type, 'easing', 'string', 'ease');
		generateAttr(type, 'speed', 'number', 3);
		generateAttr(type, 'viewport-bottom', 'number', 0);
		generateAttr(type, 'viewport-middle', 'number', 50);
		generateAttr(type, 'viewport-top', 'number', 100);

		if (type === 'vertical' || type === 'horizontal') {
			generateAttr(type, 'direction', 'string', 'up');
			generateUniqueAttributes(type, 'offset', [-4, 0, 4]);
		}

		if (type === 'rotate') {
			generateUniqueAttributes(type, 'rotate', [90, 180, 0]);
		}

		if (type === 'scale') {
			generateUniqueAttributes(type, 'scale', [70, 100, 100]);
		}

		if (type === 'fade') {
			generateUniqueAttributes(type, 'opacity', [0, 50, 100]);
		}

		if (type === 'blur') {
			generateUniqueAttributes(type, 'blur', [10, 0, 0]);
		}
	});

	Object.values(breakpoints).forEach(breakpoint => {
		const activeKey = `motion-active-${breakpoint}`;
		const activeValue = {
			type: 'string',
		};
		response[activeKey] = activeValue;

		Object.values(motionTypes).forEach(type => {
			generateAttr(type, 'status', 'boolean', 'noDefault', breakpoint);
			generateAttr(type, 'easing', 'string', 'noDefault', breakpoint);
			generateAttr(type, 'speed', 'number', 'noDefault', breakpoint);

			generateAttr(
				type,
				'viewport-bottom',
				'number',
				'noDefault',
				breakpoint
			);
			generateAttr(
				type,
				'viewport-middle',
				'number',
				'noDefault',
				breakpoint
			);
			generateAttr(
				type,
				'viewport-top',
				'number',
				'noDefault',
				breakpoint
			);

			if (type === 'vertical' || type === 'horizontal') {
				generateAttr(
					type,
					'direction',
					'string',
					'noDefault',
					breakpoint
				);
				generateUniqueAttributes(
					type,
					'offset',
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

export default motion;
