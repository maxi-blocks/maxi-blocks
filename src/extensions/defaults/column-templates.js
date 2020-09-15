/**
 * Icons
 */
import {
	oneColumn,
	oneOneThree,
	oneOneFour,
	oneThree,
	oneFour,
	oneFourOne,
	twoColumns,
	threeColumns,
	threeOne,
	threeOneOne,
	fourColumns,
	fourOne,
	fourOneOne,
	fiveColumns,
	sixColumns,
	oneOneTwo,
	oneOneOne,
	oneOneOneOne,
	twoOneOneTwo,
	oneOneTwoTwo,
	twoTwoOneOne,
	twoOneOneOneOne,
	oneOneTwoOneOne,
	oneOneOneOneTwo,
	oneOneOneOneOne,
	oneOneOneOneOneOne,
	twoTwoTwoTwoTwoTwo,
	twoTwoTwoTwo,
} from '../../icons';

/**
 * Helpers
 */
/**
 *
 * We are generating new columns again each time the user changes the pattern and adding the new columns to them
 * it's better to update columns attributes in place rather than generating again
 */
const generateDefaultColumns = (columns, gap1 = 2.5, gap2 = 2.1) => {
	const totalColumns = columns.length - 1;
	const total1 = 100 - gap1 * totalColumns;
	const total2 = 100 - gap2 * totalColumns;

	return columns.map((column, i) => [
		'maxi-blocks/column-maxi',
		{
			uniqueID: 'maxi-column-maxi-1',
			columnSize: JSON.stringify({
				label: 'Column size',
				general: {
					fullwidth: false,
					size: total1 * column,
				},
				xxl: {
					fullwidth: false,
					size: total1 * column,
				},
				xl: {
					fullwidth: false,
					size: total1 * column,
				},
				l: {
					fullwidth: false,
					size: total1 * column,
				},
				m: {
					fullwidth: false,
					size: total2 * column,
				},
				s: {
					fullwidth: false,
					size: 100,
				},
				xs: {
					fullwidth: false,
					size: 100,
				},
			}),
			margin: JSON.stringify({
				label: 'Margin',
				general: {
					'margin-top': '',
					'margin-right': '',
					'margin-bottom': '',
					'margin-left': '',
					sync: true,
					unit: 'px',
				},
				xxl: {
					'margin-top': '',
					'margin-right': '',
					'margin-bottom': '',
					'margin-left': '',
					sync: true,
					unit: '',
				},
				xl: {
					'margin-top': '',
					'margin-right': '',
					'margin-bottom': '',
					'margin-left': '',
					sync: true,
					unit: '',
				},
				l: {
					'margin-top': '',
					'margin-right': '',
					'margin-bottom': '',
					'margin-left': '',
					sync: true,
					unit: '',
				},
				m: {
					'margin-top': '',
					'margin-right': '',
					'margin-bottom': '',
					'margin-left': '',
					sync: true,
					unit: '',
				},
				s: {
					'margin-top': i !== 0 ? 0.5 : '',
					'margin-right': '',
					'margin-bottom': i !== columns.length - 1 ? 0.5 : '',
					'margin-left': '',
					sync: true,
					unit: 'em',
				},
				xs: {
					'margin-top': '',
					'margin-right': '',
					'margin-bottom': '',
					'margin-left': '',
					sync: true,
					unit: '',
				},
			}),
		},
	]);
};

/**
 * Templates
 */
const TEMPLATES = [
	{
		name: '1',
		icon: oneColumn,
		sizes: [1],
		content: generateDefaultColumns([1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1',
		icon: twoColumns,
		sizes: [1 / 2, 1 / 2],
		content: generateDefaultColumns([1 / 2, 1 / 2]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-3',
		icon: oneThree,
		sizes: [1 / 4, 3 / 4],
		content: generateDefaultColumns([1 / 4, 3 / 4]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '3-1',
		icon: threeOne,
		sizes: [3 / 4, 1 / 4],
		content: generateDefaultColumns([3 / 4, 1 / 4]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-4',
		icon: oneFour,
		sizes: [1 / 5, 4 / 5],
		content: generateDefaultColumns([1 / 5, 4 / 5]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '4-1',
		icon: fourOne,
		sizes: [4 / 5, 1 / 5],
		content: generateDefaultColumns([4 / 5, 1 / 5]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '3 columns',
		icon: threeColumns,
		sizes: [1 / 3, 1 / 3, 1 / 3],
		content: generateDefaultColumns([1 / 3, 1 / 3, 1 / 3]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-3',
		icon: oneOneThree,
		sizes: [1 / 5, 1 / 5, 3 / 5],
		content: generateDefaultColumns([1 / 5, 1 / 5, 3 / 5]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-4',
		icon: oneOneFour,
		sizes: [1 / 6, 1 / 6, 4 / 6],
		content: generateDefaultColumns([1 / 6, 1 / 6, 4 / 6]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-4-1',
		icon: oneFourOne,
		sizes: [1 / 6, 4 / 6, 1 / 6],
		content: generateDefaultColumns([1 / 6, 4 / 6, 1 / 6]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '3-1-1',
		icon: threeOneOne,
		sizes: [3 / 5, 1 / 5, 1 / 5],
		content: generateDefaultColumns([3 / 5, 1 / 5, 1 / 5]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '4-1-1',
		icon: fourOneOne,
		sizes: [4 / 6, 1 / 6, 1 / 6],
		content: generateDefaultColumns([4 / 6, 1 / 6, 1 / 6]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '4 columns',
		icon: fourColumns,
		sizes: [1 / 4, 1 / 4, 1 / 4, 1 / 4],
		content: generateDefaultColumns([1 / 4, 1 / 4, 1 / 4, 1 / 4]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '5 columns',
		icon: fiveColumns,
		sizes: [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5],
		content: generateDefaultColumns([1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '6 columns',
		icon: sixColumns,
		sizes: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
		content: generateDefaultColumns([
			1 / 6,
			1 / 6,
			1 / 6,
			1 / 6,
			1 / 6,
			1 / 6,
		]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},

	// Responsive Templates
	{
		name: '1-1-2',
		icon: oneOneTwo,
		sizes: [1 / 2, 1 / 2, 1],
		content: generateDefaultColumns([1 / 2, 1 / 2, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-1',
		icon: oneOneOne,
		sizes: [1, 1, 1],
		content: generateDefaultColumns([1, 1, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-1-1',
		icon: oneOneOneOne,
		sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2],
		content: generateDefaultColumns([1 / 2, 1 / 2, 1 / 2, 1 / 2]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '2-1-1-2',
		icon: twoOneOneTwo,
		sizes: [1, 1 / 2, 1 / 2, 1],
		content: generateDefaultColumns([1, 1 / 2, 1 / 2, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-2-2',
		icon: oneOneTwoTwo,
		sizes: [1 / 2, 1 / 2, 1, 1],
		content: generateDefaultColumns([1 / 2, 1 / 2, 1, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '2-2-1-1',
		icon: twoTwoOneOne,
		sizes: [1, 1, 1 / 2, 1 / 2],
		content: generateDefaultColumns([1, 1, 1 / 2, 1 / 2]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '2-2-2-2',
		icon: twoTwoTwoTwo,
		sizes: [1, 1, 1, 1],
		content: generateDefaultColumns([1, 1, 1, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},

	{
		name: '2-1-1-1-1',
		icon: twoOneOneOneOne,
		sizes: [1, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
		content: generateDefaultColumns([1, 1 / 2, 1 / 2, 1 / 2, 1 / 2]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-2-1-1',
		icon: oneOneTwoOneOne,
		sizes: [1 / 2, 1 / 2, 1, 1 / 2, 1 / 2],
		content: generateDefaultColumns([1 / 2, 1 / 2, 1, 1 / 2, 1 / 2]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-1-1-2',
		icon: oneOneOneOneTwo,
		sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
		content: generateDefaultColumns([1 / 2, 1 / 2, 1 / 2, 1 / 2, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-1-1-1',
		icon: oneOneOneOneOne,
		sizes: [1, 1, 1, 1, 1],
		content: generateDefaultColumns([1, 1, 1, 1, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '1-1-1-1-1-1',
		icon: oneOneOneOneOneOne,
		sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
		content: generateDefaultColumns([1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
	{
		name: '2-2-2-2-2-2',
		icon: twoTwoTwoTwoTwoTwo,
		sizes: [1, 1, 1, 1, 1, 1],
		content: generateDefaultColumns([1, 1, 1, 1, 1, 1]),
		attributes: {
			horizontalAlign: 'space-between',
			verticalAlign: 'stretch',
		},
	},
];

/**
 * Filter TEMPLATES According to DeviceType and columns number
 *
 * @param {Integer} numCol number of columns
 * @param {string} deviceType Current Selected Device Type
 * @param {Array} screens Screens in which responsive templates should display
 * @return {Array} array of templates
 */
const filterTemplates = (numCol, deviceType, screens = ['m', 's', 'xs']) => {
	const templates = {
		oneColumn: TEMPLATES.slice(0, 1),
		twoColumns: TEMPLATES.slice(1, 6),
	};

	if (screens.includes(deviceType)) {
		templates.threeColumns = TEMPLATES.slice(6, 12).concat(
			TEMPLATES.slice(15, 17)
		);

		templates.fourColumns = TEMPLATES.slice(12, 13).concat(
			TEMPLATES.slice(17, 22)
		);

		templates.fiveColumns = TEMPLATES.slice(13, 14).concat(
			TEMPLATES.slice(22, 26)
		);

		templates.sixColumns = TEMPLATES.slice(14, 15).concat(
			TEMPLATES.slice(26)
		);
	} else {
		templates.threeColumns = TEMPLATES.slice(6, 12);

		templates.fourColumns = TEMPLATES.slice(12, 13);

		templates.fiveColumns = TEMPLATES.slice(13, 14);

		templates.sixColumns = TEMPLATES.slice(14, 15);
	}

	switch (numCol) {
		case 1:
			return templates.oneColumn;
		case 2:
			return templates.twoColumns;
		case 3:
			return templates.threeColumns;
		case 4:
			return templates.fourColumns;
		case 5:
			return templates.fiveColumns;
		case 6:
			return templates.sixColumns;
		default:
			break;
	}
};

/**
 * Get columns Number
 *
 * @param {string} rowPattern number of columns
 * @return {Integer} Number of Columns of the pattern
 */
const getNumCol = rowPattern => {
	return TEMPLATES[rowPattern].sizes.length;
};

export { TEMPLATES, RESPONSIVE_TEMPLATES, filterTemplates, getNumCol };
