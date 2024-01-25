const EFFECT_PROPERTIES = {
	vertical: {
		label: 'Position',
		attr: 'offset',
		allowedUnits: ['px', 'em', 'rem', 'vh', '%'],
		minMaxSettings: {
			px: {
				min: -4000,
				max: 4000,
			},
			em: {
				min: -100,
				max: 100,
			},
			rem: {
				min: -100,
				max: 100,
			},
			vh: {
				min: -100,
				max: 100,
			},
			'%': {
				min: -100,
				max: 100,
			},
		},
	},
	horizontal: {
		label: 'Position',
		attr: 'offset',
		allowedUnits: ['px', 'em', 'rem', 'vw', '%'],
		minMaxSettings: {
			px: {
				min: -4000,
				max: 4000,
			},
			em: {
				min: -100,
				max: 100,
			},
			rem: {
				min: -100,
				max: 100,
			},
			vw: {
				min: -100,
				max: 100,
			},
			'%': {
				min: -100,
				max: 100,
			},
		},
	},
	rotate: {
		label: 'Angle',
		attr: 'rotate',
		min: -360,
		max: 360,
		unitLabel: 'deg',
	},
	scale: {
		label: 'Scale',
		attr: 'scale',
		min: 0,
		max: 1000,
		unitLabel: '%',
	},
	fade: {
		label: 'Opacity',
		attr: 'opacity',
		min: 0,
		max: 100,
		unitLabel: '%',
	},
	blur: {
		label: 'Blur',
		attr: 'blur',
		allowedUnits: ['px', 'em', 'rem'],
		minMaxSettings: {
			px: {
				min: 0,
				max: 20,
			},
			em: {
				min: 0,
				max: 20,
			},
			rem: {
				min: 0,
				max: 20,
			},
		},
	},
};

export default EFFECT_PROPERTIES;
