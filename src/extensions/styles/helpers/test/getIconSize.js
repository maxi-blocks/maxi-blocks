import getIconSize from '../getIconSize';

describe('getIconSize', () => {
	it('Should return correct icon size', () => {
		const attributes = {
			'i_h-g': '32',
			'i_h.u-g': 'px',
			'i_wfc-g': false,
			'i_w-g': '71',
			'i_w-g.h': '123',
			'i_w.u-g': '%',
		};

		// Normal state
		expect(getIconSize(attributes, false)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should use height when width is not specified', () => {
		const attributes = {
			'i_h-g': '32',
			'i_h.u-g': 'px',
			'i_h-g.h': '50',
			'i_h.u-g.h': '%',
		};

		// Normal state
		expect(getIconSize(attributes, false)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should work with prefixes', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}i_h-g`]: '32',
			[`${prefix}i_h.u-g`]: 'px',
			[`${prefix}i_h-g.h`]: '50',
			[`${prefix}i_h.u-g.h`]: '%',
		};

		// Normal state
		expect(getIconSize(attributes, false, prefix)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true, prefix)).toMatchSnapshot();
	});

	it('Should work on responsive', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}i_h-g`]: '32',
			[`${prefix}i_h.u-g`]: 'px',
			[`${prefix}i_h-g.h`]: '50',
			[`${prefix}i_h.u-g.h`]: '%',
			[`${prefix}i_h-m`]: '12',
			[`${prefix}i_h.u-m`]: 'em',
			[`${prefix}i_h-m.h`]: '15',
			[`${prefix}i_h.u-m.h`]: 'px',
		};

		// Normal state
		expect(getIconSize(attributes, false, prefix)).toMatchSnapshot();

		// Hover state
		expect(getIconSize(attributes, true, prefix)).toMatchSnapshot();
	});

	it('Should return right hover styles with only value specified on hover (no unit)', () => {
		const attributes = {
			'i_w-g': '32',
			'i_w.u-g': '%',
			'i_w-g.h': '64',
		};

		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should return right hover styles with only unit specified on hover', () => {
		const attributes = {
			'i_w-g': '32',
			'i_w.u-g': '%',
			'i_w.u-g.h': 'em',
		};

		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should return right styles with only unit specified on responsive', () => {
		const attributes = {
			'i_w-g': '32',
			'i_w.u-g': '%',
			'i_w.u-l': 'em',
		};

		expect(getIconSize(attributes, true)).toMatchSnapshot();
	});

	it('Should return right styles with height fit-content, width/height ratio > 1', () => {
		const attributes = {
			'i_w-g': '36',
			'i_w.u-g': '%',
			'i_wfc-g': true,
			'i_w-l': '32',
			'i_wfc-l': false,
			'i_w-m': '36',
			'i_wfc-m': true,
			'i-str-g': '1',
			'i-str-l': '3',
			'i-str-m': '4',
		};

		expect(getIconSize(attributes, false, '', 3)).toMatchSnapshot();
	});

	it('Should return right styles with height fit-content, width/height ratio < 1', () => {
		const attributes = {
			'i_w-g': '36',
			'i_w.u-g': '%',
			'i_wfc-g': true,
			'i_w-l': '32',
			'i_wfc-l': false,
			'i_w-m': '36',
			'i_wfc-m': true,
			'i-str-g': '1',
			'i-str-l': '3',
			'i-str-m': '4',
		};

		expect(getIconSize(attributes, false, '', 0.5)).toMatchSnapshot();
	});
});
