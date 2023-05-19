import getMarginPaddingStyles from '../getMarginPaddingStyles';

describe('getMarginPaddingStyles', () => {
	it('Get a correct margin and padding simple styles', () => {
		const obj = {
			'_m.t-general': '1',
			'_m.t.u-general': 'px',
			'_m.r-general': '2',
			'_m.r.u-general': 'px',
			'_m.b-general': '3',
			'_m.b.u-general': 'px',
			'_m.l-general': '4',
			'_m.l.u-general': 'px',
			'_m.t-xl': '1',
			'_m.t.u-xl': 'px',
			'_m.r-xl': '2',
			'_m.r.u-xl': 'px',
			'_m.b-xl': '3',
			'_m.b.u-xl': 'px',
			'_m.l-xl': '4',
			'_m.l.u-xl': 'px',
			'_p.t-general': '1',
			'_p.t.u-general': 'px',
			'_p.r-general': '2',
			'_p.r.u-general': 'px',
			'_p.b-general': '3',
			'_p.b.u-general': 'px',
			'_p.l-general': '4',
			'_p.l.u-general': 'px',
			'_p.t-xl': '1',
			'_p.t.u-xl': 'px',
			'_p.r-xl': '2',
			'_p.r.u-xl': 'px',
			'_p.b-xl': '3',
			'_p.b.u-xl': 'px',
			'_p.l-xl': '4',
			'_p.l.u-xl': 'px',
		};

		const result = getMarginPaddingStyles({ obj });
		expect(result).toMatchSnapshot();
	});

	it('Get a correct margin and padding', () => {
		const obj = {
			'_m.t-general': '1',
			'_m.r-general': '2',
			'_m.b-general': '3',
			'_m.l-general': '4',
			'_m.sy-general': true,
			'_m.t.u-general': 'px',
			'_m.r.u-general': 'px',
			'_m.b.u-general': 'px',
			'_m.l.u-general': 'px',
			'_m.t-xxl': '1',
			'_m.r-xxl': '2',
			'_m.b-xxl': '3',
			'_m.l-xxl': '4',
			'_m.sy-xxl': true,
			'_m.t.u-xxl': '%',
			'_m.r.u-xxl': '%',
			'_m.b.u-xxl': '%',
			'_m.l.u-xxl': '%',
			'_m.t-xl': '1',
			'_m.r-xl': '2',
			'_m.b-xl': '3',
			'_m.l-xl': '4',
			'_m.sy-xl': true,
			'_m.t.u-xl': '%',
			'_m.r.u-xl': '%',
			'_m.b.u-xl': '%',
			'_m.l.u-xl': '%',
			'_m.t-l': '1',
			'_m.r-l': '2',
			'_m.b-l': '3',
			'_m.l-l': '4',
			'_m.sy-l': true,
			'_m.t.u-l': 'px',
			'_m.r.u-l': 'px',
			'_m.b.u-l': 'px',
			'_m.l.u-l': 'px',
			'_m.t-m': '1',
			'_m.r-m': '2',
			'_m.b-m': '3',
			'_m.l-m': '4',
			'_m.sy-m': true,
			'_m.t.u-m': 'px',
			'_m.r.u-m': 'px',
			'_m.b.u-m': 'px',
			'_m.l.u-m': 'px',
			'_m.t-s': '1',
			'_m.r-s': '2',
			'_m.b-s': '3',
			'_m.l-s': '4',
			'_m.sy-s': true,
			'_m.t.u-s': '%',
			'_m.r.u-s': '%',
			'_m.b.u-s': '%',
			'_m.l.u-s': '%',
			'_m.t-xs': '1',
			'_m.r-xs': '2',
			'_m.b-xs': '3',
			'_m.l-xs': '4',
			'_m.sy-xs': true,
			'_m.t.u-xs': 'px',
			'_m.r.u-xs': 'px',
			'_m.b.u-xs': 'px',
			'_m.l.u-xs': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
	});

	it('Different values ​​depends on the responsive', () => {
		const obj = {
			'_m.t-general': '11',
			'_m.r-general': '11',
			'_m.b-general': '11',
			'_m.l-general': '11',
			'_m.sy-general': true,
			'_m.t.u-general': 'px',
			'_m.r.u-general': 'px',
			'_m.b.u-general': 'px',
			'_m.l.u-general': 'px',
			'_m.t-xxl': '12',
			'_m.r-xxl': '12',
			'_m.b-xxl': '12',
			'_m.l-xxl': '12',
			'_m.sy-xxl': true,
			'_m.t.u-xxl': '%',
			'_m.r.u-xxl': '%',
			'_m.b.u-xxl': '%',
			'_m.l.u-xxl': '%',
			'_m.t-xl': '45',
			'_m.r-xl': '45',
			'_m.b-xl': '45',
			'_m.l-xl': '45',
			'_m.sy-xl': true,
			'_m.t.u-xl': '%',
			'_m.r.u-xl': '%',
			'_m.b.u-xl': '%',
			'_m.l.u-xl': '%',
			'_m.t-l': '5',
			'_m.r-l': '5',
			'_m.b-l': '5',
			'_m.l-l': '5',
			'_m.sy-l': true,
			'_m.t.u-l': 'px',
			'_m.r.u-l': 'px',
			'_m.b.u-l': 'px',
			'_m.l.u-l': 'px',
			'_m.t-m': '0',
			'_m.r-m': '2',
			'_m.b-m': '6',
			'_m.l-m': '4',
			'_m.sy-m': true,
			'_m.t.u-m': 'px',
			'_m.r.u-m': 'px',
			'_m.b.u-m': 'px',
			'_m.l.u-m': 'px',
			'_m.t-s': '0',
			'_m.r-s': '0',
			'_m.b-s': '0',
			'_m.l-s': '0',
			'_m.sy-s': true,
			'_m.t.u-s': '%',
			'_m.r.u-s': '%',
			'_m.b.u-s': '%',
			'_m.l.u-s': '%',
			'_m.t-xs': '1',
			'_m.r-xs': '1',
			'_m.b-xs': '1',
			'_m.l-xs': '1',
			'_m.sy-xs': true,
			'_m.t.u-xs': 'px',
			'_m.r.u-xs': 'px',
			'_m.b.u-xs': 'px',
			'_m.l.u-xs': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a correct margin and padding styles, when only unit on some breakpoint was changed', () => {
		const obj = {
			'_m.t-general': '11',
			'_m.t.u-general': 'em',
			'_m.t-xl': '11',
			'_m.t.u-xl': 'em',
			'_m.t.u-xxl': 'px',
			'_m.t.u-m': '%',
		};
		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a correct margin and padding styles, when value is undefined but unit is defined', () => {
		const obj = {
			'_m.t-general': '',
			'_m.r-general': '',
			'_m.b-general': '',
			'_m.l-general': '',
			'_m.sy-general': 'all',
			'_m.t.u-general': 'px',
			'_m.r.u-general': 'px',
			'_m.b.u-general': 'px',
			'_m.l.u-general': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
	});
});
