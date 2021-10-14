const motionTypes = [
	'vertical',
	'horizontal',
	'rotate',
	'scale',
	'fade',
	'blur',
];

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

export const motion = (() => {
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
	Object.values(motionTypes).forEach(type => {
		const statusKey = `motion-status-${type}-general`;
		const statusValue = {
			type: 'boolean',
			default: false,
		};
		response[statusKey] = statusValue;

		const easingKey = `motion-easing-${type}-general`;
		const easingValue = {
			type: 'string',
		};
		response[easingKey] = easingValue;

		const directionKey = `motion-direction-${type}-general`;
		const directionValue = {
			type: 'string',
		};
		response[directionKey] = directionValue;

		const speedKey = `motion-speed-${type}-general`;
		const speedValue = {
			type: 'number',
			default: 2,
		};
		response[speedKey] = speedValue;

		const offsetStartKey = `motion-offset-start-${type}-general`;
		const offsetStartValue = {
			type: 'number',
			default: 0,
		};
		response[offsetStartKey] = offsetStartValue;

		const offsetMiddleKey = `motion-offset-middle-${type}-general`;
		const offsetMiddleValue = {
			type: 'number',
			default: 50,
		};
		response[offsetMiddleKey] = offsetMiddleValue;

		const offsetEndKey = `motion-offset-end-${type}-general`;
		const offsetEndValue = {
			type: 'number',
			default: 100,
		};
		response[offsetEndKey] = offsetEndValue;
	});

	Object.values(breakpoints).forEach(breakpoint => {
		const activeKey = `motion-active-${breakpoint}`;
		const activeValue = {
			type: 'string',
		};
		response[activeKey] = activeValue;

		Object.values(motionTypes).forEach(type => {
			const statusKey = `motion-status-${type}-${breakpoint}`;
			const statusValue = {
				type: 'boolean',
			};
			response[statusKey] = statusValue;

			const statusTabletKey = `motion-status-table-${type}-${breakpoint}`;
			const statusTableValue = {
				type: 'boolean',
			};
			response[statusTabletKey] = statusTableValue;

			const statusMobileKey = `motion-status-mobile-${type}-${breakpoint}`;
			const statusMobileValue = {
				type: 'boolean',
			};
			response[statusMobileKey] = statusMobileValue;

			const easingKey = `motion-easing-${type}-${breakpoint}`;
			const easingValue = {
				type: 'string',
			};
			response[easingKey] = easingValue;

			const directionKey = `motion-direction-${type}-${breakpoint}`;
			const directionValue = {
				type: 'string',
			};
			response[directionKey] = directionValue;

			const speedKey = `motion-speed-${type}-${breakpoint}`;
			const speedValue = {
				type: 'number',
			};
			response[speedKey] = speedValue;

			const offsetStartKey = `motion-offset-start-${type}-${breakpoint}`;
			const offsetStartValue = {
				type: 'number',
			};
			response[offsetStartKey] = offsetStartValue;

			const offsetMiddleKey = `motion-offset-middle-${type}-${breakpoint}`;
			const offsetMiddleValue = {
				type: 'number',
			};
			response[offsetMiddleKey] = offsetMiddleValue;

			const offsetEndKey = `motion-offset-end-${type}-${breakpoint}`;
			const offsetEndValue = {
				type: 'number',
			};
			response[offsetEndKey] = offsetEndValue;
		});
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
