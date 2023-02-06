import getIconSize from '../getIconSize';

describe('getIconSize', () => {
	it('Should return correct icon size', () => {
		const attributes = {
			'icon-height-general': '32',
			'icon-height-unit-general': 'px',
			'icon-width-fit-content-general': false,
			'icon-width-general': '71',
			'icon-width-general-hover': '123',
			'icon-width-unit-general': '%',
		};

		// Normal state
		expect(getIconSize(attributes, false)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should use height when width is not specified', () => {
		const attributes = {
			'icon-height-general': '32',
			'icon-height-unit-general': 'px',
			'icon-height-general-hover': '50',
			'icon-height-unit-general-hover': '%',
		};

		// Normal state
		expect(getIconSize(attributes, false)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should work with prefixes', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}icon-height-general`]: '32',
			[`${prefix}icon-height-unit-general`]: 'px',
			[`${prefix}icon-height-general-hover`]: '50',
			[`${prefix}icon-height-unit-general-hover`]: '%',
		};

		// Normal state
		expect(getIconSize(attributes, false, prefix)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true, prefix)).toMatchSnapshot();
	});

	it('Should work on responsive', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}icon-height-general`]: '32',
			[`${prefix}icon-height-unit-general`]: 'px',
			[`${prefix}icon-height-general-hover`]: '50',
			[`${prefix}icon-height-unit-general-hover`]: '%',
			[`${prefix}icon-height-m`]: '12',
			[`${prefix}icon-height-unit-m`]: 'em',
			[`${prefix}icon-height-m-hover`]: '15',
			[`${prefix}icon-height-unit-m-hover`]: 'px',
		};

		// Normal state
		expect(getIconSize(attributes, false, prefix)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true, prefix)).toMatchSnapshot();
	});

	it('Should return right hover styles with only value specified on hover (no unit)', () => {
		const attributes = {
			'icon-width-general': '32',
			'icon-width-unit-general': '%',
			'icon-width-general-hover': '64',
		};

		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should return right hover styles with only unit specified on hover', () => {
		const attributes = {
			'icon-width-general': '32',
			'icon-width-unit-general': '%',
			'icon-width-unit-general-hover': 'em',
		};

		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should return right styles with only unit specified on responsive', () => {
		const attributes = {
			'icon-width-general': '32',
			'icon-width-unit-general': '%',
			'icon-width-unit-l': 'em',
		};

		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});
});
