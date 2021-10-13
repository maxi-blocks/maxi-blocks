const motionTypes = [
	'vertical',
	'horizontal',
	'rotate',
	'scale',
	'fade',
	'blur',
];

export const motion = (() => {
	const response = {
		'motion-active': {
			type: 'string',
		},
		'motion-preset-status': {
			type: 'boolean',
			default: false,
		},
		'motion-preview-status': {
			type: 'boolean',
			default: false,
		},
	};

	Object.values(motionTypes).forEach(type => {
		const statusKey = `motion-status-${type}`;
		const statusValue = {
			type: 'boolean',
			default: false,
		};
		response[statusKey] = statusValue;

		const statusTabletKey = `motion-status-table-${type}`;
		const statusTableValue = {
			type: 'boolean',
			default: true,
		};
		response[statusTabletKey] = statusTableValue;

		const statusMobileKey = `motion-status-mobile-${type}`;
		const statusMobileValue = {
			type: 'boolean',
			default: true,
		};
		response[statusMobileKey] = statusMobileValue;

		const easingKey = `motion-easing-${type}`;
		const easingValue = {
			type: 'string',
		};
		response[easingKey] = easingValue;

		const directionKey = `motion-direction-${type}`;
		const directionValue = {
			type: 'string',
		};
		response[directionKey] = directionValue;

		const speedKey = `motion-speed-${type}`;
		const speedValue = {
			type: 'number',
			default: 2,
		};
		response[speedKey] = speedValue;
	});

	return response;
})();

export const parallax = {
	'parallax-status': {
		type: 'boolean',
		default: false,
	},
	'parallax-speed': {
		type: 'number',
		default: 4,
	},
	'parallax-direction': {
		type: 'string',
		default: 'up',
	},
};
