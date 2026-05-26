const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const linkPaletteTargets = [
	'link',
	'link-hover',
	'link-active',
	'link-visited',
];

const styleCardTargets = {
	link: 'link',
	'link-hover': 'hover',
	'link-active': 'active',
	'link-visited': 'visited',
};

const getBreakpoint = breakpoint =>
	breakpoints.includes(breakpoint) ? breakpoint : 'general';

const hasBreakpointValue = (attributes = {}, target, condition) =>
	condition(attributes[target]) ||
	breakpoints.some(breakpoint =>
		condition(attributes[`${target}-${breakpoint}`])
	);

const isLinkOverrideKey = (key, prefix = '') =>
	linkPaletteTargets.some(
		target =>
			key.startsWith(`${prefix}${target}-palette`) ||
			key.startsWith(`${prefix}${target}-color`)
	);

const getCustomFormatsWithoutLinkOverrides = customFormats => {
	if (!customFormats || typeof customFormats !== 'object') return customFormats;

	return Object.fromEntries(
		Object.entries(customFormats).map(([formatKey, formatValue]) => {
			if (!formatValue || typeof formatValue !== 'object') {
				return [formatKey, formatValue];
			}

			return [
				formatKey,
				Object.fromEntries(
					Object.entries(formatValue).filter(
						([key]) => !isLinkOverrideKey(key)
					)
				),
			];
		})
	);
};

export const getLinkPaletteScStatusUpdates = (
	prefix = '',
	status,
	breakpoint = 'general',
	styleCardValues = {},
	customFormats
) =>
	Object.fromEntries(
		[
			...linkPaletteTargets.flatMap(target => {
				const targetBreakpoints = status
					? [getBreakpoint(breakpoint)]
					: breakpoints;
				const styleCardTarget = styleCardValues?.[styleCardTargets[target]];

				return targetBreakpoints.flatMap(currentBreakpoint => [
					[
						`${prefix}${target}-palette-sc-status-${currentBreakpoint}`,
						status,
					],
					...(!status
						? [
								[
									`${prefix}${target}-palette-status-${currentBreakpoint}`,
									true,
								],
								[
									`${prefix}${target}-color-${currentBreakpoint}`,
									undefined,
								],
								[
									`${prefix}${target}-palette-color-${currentBreakpoint}`,
									currentBreakpoint === 'general'
										? styleCardTarget?.paletteColor
										: undefined,
								],
								[
									`${prefix}${target}-palette-opacity-${currentBreakpoint}`,
									currentBreakpoint === 'general'
										? styleCardTarget?.paletteOpacity
										: undefined,
								],
						  ]
						: []),
				]);
			}),
			...(!status && customFormats
				? [
						[
							'custom-formats',
							getCustomFormatsWithoutLinkOverrides(customFormats),
						],
				  ]
				: []),
		]
	);

export const getIsLinkStyleCardOverwriteEnabled = (
	attributes = {},
	prefix = ''
) =>
	linkPaletteTargets.some(target => {
		const paletteScStatus = hasBreakpointValue(
			attributes,
			`${prefix}${target}-palette-sc-status`,
			value => value === true
		);
		const customPaletteStatus = hasBreakpointValue(
			attributes,
			`${prefix}${target}-palette-status`,
			value => value === false
		);

		return paletteScStatus || customPaletteStatus;
	});
