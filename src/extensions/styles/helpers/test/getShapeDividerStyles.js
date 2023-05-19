import {
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
} from '../getShapeDividerStyles';

describe('getShapeDividerStyles', () => {
	it('Get a correct shape divider styles', () => {
		const object = {
			'sdt.s': true,
			'sdt_h-general': 1,
			'sdt_h.u-general': 'px',
			'sdt_o-general': 1,
			sdt_ss: 'default',
			'sdt_ef.s': true,
			'sdt_cc-general': 'rgb(255, 99, 71)',
			'sdb.s': true,
			'sdb_h-general': 3,
			'sdb_h.u-general': 'px',
			'sdb_o-general': 0.51,
			sdb_ss: 'default',
			'sdb_ef.s': true,
			'sdb_cc-general': 'rgb(255, 99, 71)',
		};

		const objectSVGStyles = {
			'sdt.s': true,
			'sdt_h-general': 3,
			'sdt_h.u-general': 'px',
			'sdt_o-general': 0.98,
			sdt_ss: 'default',
			'sdt_ef.s': true,
			'sdt_cc-general': 'rgb(255, 99, 71)',
			'sdb.s': true,
			'sdb_h-general': 1,
			'sdb_h.u-general': 'px',
			'sdb_o-general': 1,
			sdb_ss: 'default',
			'sdb_ef.s': true,
			'sdb_cc-general': 'rgb(255, 99, 71)',
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
