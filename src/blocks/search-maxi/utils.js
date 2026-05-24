export const iconPositionBreakpoints = [
	'general',
	'xxl',
	'xl',
	'l',
	'm',
	's',
	'xs',
];

const breakpointFallbacks = {
	general: ['general'],
	xxl: ['xxl', 'general'],
	xl: ['xl', 'general'],
	l: ['l', 'xl', 'general'],
	m: ['m', 'l', 'xl', 'general'],
	s: ['s', 'm', 'l', 'xl', 'general'],
	xs: ['xs', 's', 'm', 'l', 'xl', 'general'],
};

const positions = {
	left: {
		block: {
			'justify-content': 'flex-start',
		},
		button: {
			order: 0,
		},
		input: {
			'margin-left': '-25px !important',
			'margin-right': '0 !important',
		},
		hiddenInput: {
			'margin-left': '-25px !important',
			'margin-right': '0 !important',
			'padding-left': '35px !important',
			'padding-right': '10px !important',
			'border-left-width': '0 !important',
			'border-right-width': '4px !important',
		},
		settings: {
			'border-left-width': 0,
			'border-right-width': 4,
			'padding-left': 35,
			'padding-right': 10,
		},
	},
	center: {
		block: {
			'justify-content': 'center',
		},
		button: {
			order: 1,
		},
		input: {
			'margin-left': '0 !important',
			'margin-right': '-25px !important',
		},
		hiddenInput: {
			'margin-left': '0 !important',
			'margin-right': '0 !important',
			'padding-left': '0 !important',
			'padding-right': '0 !important',
			'border-left-width': '0 !important',
			'border-right-width': '0 !important',
		},
		settings: {
			'border-left-width': 4,
			'border-right-width': 4,
			'padding-left': 10,
			'padding-right': 10,
		},
	},
	right: {
		block: {
			'justify-content': 'flex-end',
		},
		button: {
			order: 2,
		},
		input: {
			'margin-left': '0 !important',
			'margin-right': '-25px !important',
		},
		hiddenInput: {
			'margin-left': '0 !important',
			'margin-right': '-25px !important',
			'padding-left': '10px !important',
			'padding-right': '35px !important',
			'border-left-width': '4px !important',
			'border-right-width': '0 !important',
		},
		settings: {
			'border-left-width': 4,
			'border-right-width': 0,
			'padding-left': 10,
			'padding-right': 35,
		},
	},
};

const createResponsiveStyleObject = label => ({
	label,
});

const hasBreakpointValue = styles => Object.keys(styles).length > 1;

export const getIconPositionResetAttributes = (position = 'right') =>
	iconPositionBreakpoints.reduce(
		(acc, breakpoint) => ({
			...acc,
			[`icon-position-${breakpoint}`]: position,
		}),
		{
			'icon-position': position,
		}
	);

export const getIconRevealPositionSettings = (
	position,
	breakpoint = 'general'
) => {
	const settings = positions[position]?.settings;
	if (!settings) return undefined;

	return Object.entries(settings).reduce((acc, [key, value]) => {
		acc[`input-${key}-${breakpoint}`] = value;
		return acc;
	}, {});
};

export const getResponsiveIconPosition = (
	attributes,
	breakpoint = 'general'
) => {
	const fallbackBreakpoints =
		breakpointFallbacks[breakpoint] || breakpointFallbacks.general;

	const responsivePosition = fallbackBreakpoints
		.map(
			currentBreakpoint =>
				attributes?.[`icon-position-${currentBreakpoint}`]
		)
		.find(Boolean);

	return responsivePosition || attributes?.['icon-position'];
};

export const getIconRevealPositionStyles = attributes => {
	const response = {
		block: createResponsiveStyleObject('Icon reveal position'),
		button: createResponsiveStyleObject('Icon reveal button position'),
		input: createResponsiveStyleObject('Icon reveal input position'),
		hiddenInput: createResponsiveStyleObject(
			'Icon reveal hidden input position'
		),
	};

	iconPositionBreakpoints.forEach(breakpoint => {
		const position =
			attributes?.[`icon-position-${breakpoint}`] ||
			(breakpoint === 'general'
				? attributes?.['icon-position']
				: undefined);
		const positionStyles = positions[position];

		if (!positionStyles) return;

		response.block[breakpoint] = positionStyles.block;
		response.button[breakpoint] = positionStyles.button;
		response.input[breakpoint] = positionStyles.input;
		response.hiddenInput[breakpoint] = positionStyles.hiddenInput;
	});

	return Object.entries(response).reduce((acc, [key, value]) => {
		if (hasBreakpointValue(value)) acc[key] = value;
		return acc;
	}, {});
};
