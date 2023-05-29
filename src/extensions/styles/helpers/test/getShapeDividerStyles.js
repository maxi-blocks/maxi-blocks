import {
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
} from '../getShapeDividerStyles';

describe('getShapeDividerStyles', () => {
	it('Get a correct shape divider styles', () => {
		const object = {
			'sdt.s': true,
			'sdt_h-g': 1,
			'sdt_h.u-g': 'px',
			'sdt_o-g': 1,
			sdt_ss: 'default',
			'sdt_ef.s': true,
			'sdt_cc-g': 'rgb(255, 99, 71)',
			'sdb.s': true,
			'sdb_h-g': 3,
			'sdb_h.u-g': 'px',
			'sdb_o-g': 0.51,
			sdb_ss: 'default',
			'sdb_ef.s': true,
			'sdb_cc-g': 'rgb(255, 99, 71)',
		};

		const objectSVGStyles = {
			'sdt.s': true,
			'sdt_h-g': 3,
			'sdt_h.u-g': 'px',
			'sdt_o-g': 0.98,
			sdt_ss: 'default',
			'sdt_ef.s': true,
			'sdt_cc-g': 'rgb(255, 99, 71)',
			'sdb.s': true,
			'sdb_h-g': 1,
			'sdb_h.u-g': 'px',
			'sdb_o-g': 1,
			sdb_ss: 'default',
			'sdb_ef.s': true,
			'sdb_cc-g': 'rgb(255, 99, 71)',
		};

		const result = getShapeDividerStyles(object, 'top');
		expect(result).toMatchSnapshot();

		const resultSVGStyles = getShapeDividerSVGStyles(
			objectSVGStyles,
			'bottom'
		);
		expect(resultSVGStyles).toMatchSnapshot();
	});
});
