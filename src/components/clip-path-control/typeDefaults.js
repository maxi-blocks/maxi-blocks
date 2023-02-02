const typeDefaults = {
	polygon: {
		0: [
			{ value: 0, unit: '%' },
			{ value: 0, unit: '%' },
		],
		1: [
			{ value: 100, unit: '%' },
			{ value: 0, unit: '%' },
		],
		2: [
			{ value: 100, unit: '%' },
			{ value: 100, unit: '%' },
		],
		3: [
			{ value: 0, unit: '%' },
			{ value: 100, unit: '%' },
		],
	},
	circle: {
		0: [{ value: 50, unit: '%' }],
		1: [
			{ value: 50, unit: '%' },
			{ value: 50, unit: '%' },
		],
	},
	ellipse: {
		0: [{ value: 25, unit: '%' }],
		1: [{ value: 50, unit: '%' }],
		2: [
			{ value: 50, unit: '%' },
			{ value: 50, unit: '%' },
		],
	},
	inset: {
		0: [{ value: 15, unit: '%' }],
		1: [{ value: 5, unit: '%' }],
		2: [{ value: 15, unit: '%' }],
		3: [{ value: 5, unit: '%' }],
	},
};

export default typeDefaults;
