export const FILTER_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const IMAGE_FILTER_CONTROLS = [
	{
		key: 'blur',
		cssFunction: 'blur',
		unit: 'px',
		defaultValue: 0,
		min: 0,
		max: 100,
		step: 1,
	},
	{
		key: 'brightness',
		cssFunction: 'brightness',
		unit: '%',
		defaultValue: 100,
		min: 0,
		max: 300,
		step: 1,
	},
	{
		key: 'contrast',
		cssFunction: 'contrast',
		unit: '%',
		defaultValue: 100,
		min: 0,
		max: 300,
		step: 1,
	},
	{
		key: 'grayscale',
		cssFunction: 'grayscale',
		unit: '%',
		defaultValue: 0,
		min: 0,
		max: 100,
		step: 1,
	},
	{
		key: 'hue-rotate',
		cssFunction: 'hue-rotate',
		unit: 'deg',
		defaultValue: 0,
		min: 0,
		max: 360,
		step: 1,
	},
	{
		key: 'invert',
		cssFunction: 'invert',
		unit: '%',
		defaultValue: 0,
		min: 0,
		max: 100,
		step: 1,
	},
	{
		key: 'opacity',
		cssFunction: 'opacity',
		unit: '%',
		defaultValue: 100,
		min: 0,
		max: 100,
		step: 1,
	},
	{
		key: 'saturate',
		cssFunction: 'saturate',
		unit: '%',
		defaultValue: 100,
		min: 0,
		max: 300,
		step: 1,
	},
	{
		key: 'sepia',
		cssFunction: 'sepia',
		unit: '%',
		defaultValue: 0,
		min: 0,
		max: 100,
		step: 1,
	},
];

export const IMAGE_FILTER_DROP_SHADOW_CONTROLS = [
	{
		key: 'horizontal',
		defaultValue: 0,
		min: -200,
		max: 200,
		step: 1,
	},
	{
		key: 'vertical',
		defaultValue: 0,
		min: -200,
		max: 200,
		step: 1,
	},
	{
		key: 'blur',
		defaultValue: 0,
		min: 0,
		max: 200,
		step: 1,
	},
];

export const IMAGE_FILTER_DROP_SHADOW_COLOR_DEFAULT = 'rgba(0,0,0,0.35)';

export const getFilterAttribute = key => `image-filter-${key}`;

export const getDropShadowAttribute = key => `image-filter-drop-shadow-${key}`;

export const IMAGE_FILTER_STATUS_HOVER = 'image-filter-status-hover';

export const IMAGE_FILTER_ATTRIBUTE_KEYS = FILTER_BREAKPOINTS.flatMap(
	breakpoint => [
		...IMAGE_FILTER_CONTROLS.map(
			({ key }) => `${getFilterAttribute(key)}-${breakpoint}`
		),
		...IMAGE_FILTER_DROP_SHADOW_CONTROLS.map(
			({ key }) => `${getDropShadowAttribute(key)}-${breakpoint}`
		),
		`${getDropShadowAttribute('color')}-${breakpoint}`,
	]
);

export const IMAGE_FILTER_HOVER_ATTRIBUTE_KEYS = [
	IMAGE_FILTER_STATUS_HOVER,
	...IMAGE_FILTER_ATTRIBUTE_KEYS.map(key => `${key}-hover`),
];

export const IMAGE_FILTER_ALL_ATTRIBUTE_KEYS = [
	...IMAGE_FILTER_ATTRIBUTE_KEYS,
	...IMAGE_FILTER_HOVER_ATTRIBUTE_KEYS,
];
