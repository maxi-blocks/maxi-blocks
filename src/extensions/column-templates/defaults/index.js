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
	twoTwo,
	threeColumns,
	threeOne,
	oneTwoTwo,
	threeOneOne,
	fourColumns,
	fourOne,
	fourOneOne,
	fiveColumns,
	sixColumns,
	sevenColumns,
	twoOneOneOneOneOneOne,
	oneOneOneOneOneOneOneThree,
	threeOneOneOneOneOneOneOne,
	oneOneOneOneOneOneTwo,
	oneOneOneOneOneOneOne,
	eightColumns,
	oneOneOneOneOneOneOneOne,
	twoTwoTwoTwoTwoTwoTwoTwo,
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
} from '../../../icons';

/**
 * Helpers
 */

/**
 * Get columns positions (Row number and the number of columns in the row)
 *
 * @param {Array} sizes array of columns widths
 * @return {Array} Array of objects
 */

const getColumnsPositions = sizes => {
	const columnsPositions = [];

	let columnsSizeSum = 0;
	let columnsNumberInOneRow = 0;
	let rowsCount = 1;

	sizes.forEach(size => {
		columnsSizeSum += size;
		columnsNumberInOneRow += 1;

		columnsPositions.push({
			rowNumber: rowsCount,
		});

		if (Math.round(columnsSizeSum * 100 + Number.EPSILON) / 100 === 1) {
			columnsPositions.forEach(column => {
				if (!column.columnsNumber) {
					column.columnsNumber = columnsNumberInOneRow;
				}
			});

			rowsCount += 1;
			columnsSizeSum = 0;
			columnsNumberInOneRow = 0;
		}
	});

	return columnsPositions;
};

/**
 * Apply gap on columns sizes array
 *
 * @param {Array} sizes array of columns widths
 * @return {Array} columns sizes after applying the gap
 */
const columnAttributesGenerator = (columns, isResponsive) => {
	const newColumnsSizes = [];
	const columnsPositions = getColumnsPositions(columns);

	// This sentence is important vvv
	// const gap = props.removeColumnGap ? 2.5 : 0;
	const gap = 2.5;

	const responsive = isResponsive ? 'm' : 'general';

	columns.forEach((column, i) => {
		if (columnsPositions[i].columnsNumber > 1) {
			const numberOfGaps = columnsPositions[i].columnsNumber - 1;
			const total = 100 - gap * numberOfGaps;
			newColumnsSizes.push({
				withGap: {
					[`column-size-${responsive}`]: column * total,
					...(!isResponsive && { 'column-size-m': 100 }),
					...((columnsPositions[i].rowNumber > 1 && {
						'margin-top-m': 2.5,
						'margin-unit-m': '%',
					}) ||
						(isResponsive && {
							'margin-top-m': '',
						})),
				},
				withoutGap: {
					[`column-size-${responsive}`]: column * 100,
					...(!isResponsive && { 'column-size-m': 100 }),
					...((columnsPositions[i].rowNumber > 1 && {
						'margin-top-m': 2.5,
						'margin-unit-m': '%',
					}) ||
						(isResponsive && {
							'margin-top-m': '',
						})),
				},
			});
		}
		if (columnsPositions[i].columnsNumber === 1) {
			newColumnsSizes.push({
				withGap: {
					[`column-size-${responsive}`]: 100,
					...(!isResponsive && { 'column-size-m': 100 }),
					...((columnsPositions[i].rowNumber > 1 && {
						'margin-top-m': 2.5,
						'margin-unit-m': '%',
					}) ||
						(isResponsive && {
							'margin-top-m': '',
						})),
				},
				withoutGap: {
					[`column-size-${responsive}`]: 100,
					...(!isResponsive && { 'column-size-m': 100 }),
					...((columnsPositions[i].rowNumber > 1 && {
						'margin-top-m': 2.5,
						'margin-unit-m': '%',
					}) ||
						(isResponsive && {
							'margin-top-m': '',
						})),
				},
			});
		}
	});

	return newColumnsSizes;
};

/**
 *
 * We are generating new columns again each time the user changes the pattern and adding the new columns to them
 * it's better to update columns attributes in place rather than generating again
 */
const generateDefaultColumns = (columns, isResponsive = false) => {
	const newAttributes = columnAttributesGenerator(columns, isResponsive);

	return newAttributes.map(colAttr => {
		return ['maxi-blocks/column-maxi', { ...colAttr }];
	});
};

// Array of all templates
const columnTemplates = {
	oneColumn: {
		default: [
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
		],
		responsive: [],
	},

	twoColumns: {
		default: [
			{
				name: '1-1',
				icon: twoColumns,
				sizes: [1 / 2, 1 / 2],
				responsiveLayout: '2-2',
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
				responsiveLayout: '2-2',
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
				responsiveLayout: '2-2',
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
				responsiveLayout: '2-2',
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
				responsiveLayout: '2-2',
				content: generateDefaultColumns([4 / 5, 1 / 5]),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
		responsive: [
			{
				name: '2-2',
				icon: twoTwo,
				sizes: [1, 1],
				content: generateDefaultColumns([1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},

	threeColumns: {
		default: [
			{
				name: '3 columns',
				icon: threeColumns,
				sizes: [1 / 3, 1 / 3, 1 / 3],
				responsiveLayout: '1-1-1',
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
				responsiveLayout: '1-1-1',
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
				responsiveLayout: '1-1-1',
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
				responsiveLayout: '1-1-1',
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
				responsiveLayout: '1-1-1',
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
				responsiveLayout: '1-1-1',
				content: generateDefaultColumns([4 / 6, 1 / 6, 1 / 6]),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
		responsive: [
			{
				name: '1-1-2',
				icon: oneOneTwo,
				sizes: [1 / 2, 1 / 2, 1],
				content: generateDefaultColumns([1 / 2, 1 / 2, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-2-2',
				icon: oneTwoTwo,
				sizes: [1, 1 / 2, 1 / 2],
				content: generateDefaultColumns([1, 1 / 2, 1 / 2], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1',
				icon: oneOneOne,
				sizes: [1, 1, 1],
				content: generateDefaultColumns([1, 1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},

	fourColumns: {
		default: [
			{
				name: '4 columns',
				icon: fourColumns,
				sizes: [1 / 4, 1 / 4, 1 / 4, 1 / 4],
				responsiveLayout: '2-2-2-2',
				content: generateDefaultColumns([1 / 4, 1 / 4, 1 / 4, 1 / 4]),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
		responsive: [
			{
				name: '1-1-1-1',
				icon: oneOneOneOne,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2],
				content: generateDefaultColumns(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '2-1-1-2',
				icon: twoOneOneTwo,
				sizes: [1, 1 / 2, 1 / 2, 1],
				content: generateDefaultColumns([1, 1 / 2, 1 / 2, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-2-2',
				icon: oneOneTwoTwo,
				sizes: [1 / 2, 1 / 2, 1, 1],
				content: generateDefaultColumns([1 / 2, 1 / 2, 1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '2-2-1-1',
				icon: twoTwoOneOne,
				sizes: [1, 1, 1 / 2, 1 / 2],
				content: generateDefaultColumns([1, 1, 1 / 2, 1 / 2], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '2-2-2-2',
				icon: twoTwoTwoTwo,
				sizes: [1, 1, 1, 1],
				content: generateDefaultColumns([1, 1, 1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},

	fiveColumns: {
		default: [
			{
				name: '5 columns',
				icon: fiveColumns,
				sizes: [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5],
				responsiveLayout: '1-1-1-1-1',
				content: generateDefaultColumns([
					1 / 5,
					1 / 5,
					1 / 5,
					1 / 5,
					1 / 5,
				]),

				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
		responsive: [
			{
				name: '2-1-1-1-1',
				icon: twoOneOneOneOne,
				sizes: [1, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
				content: generateDefaultColumns(
					[1, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-2-1-1',
				icon: oneOneTwoOneOne,
				sizes: [1 / 2, 1 / 2, 1, 1 / 2, 1 / 2],
				content: generateDefaultColumns(
					[1 / 2, 1 / 2, 1, 1 / 2, 1 / 2],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1-1-2',
				icon: oneOneOneOneTwo,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
				content: generateDefaultColumns(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1-1-1',
				icon: oneOneOneOneOne,
				sizes: [1, 1, 1, 1, 1],
				content: generateDefaultColumns([1, 1, 1, 1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},

	sixColumns: {
		default: [
			{
				name: '6 columns',
				icon: sixColumns,
				sizes: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
				responsiveLayout: '2-2-2-2-2-2',
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
		],
		responsive: [
			{
				name: '1-1-1-1-1-1',
				icon: oneOneOneOneOneOne,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
				content: generateDefaultColumns(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '2-2-2-2-2-2',
				icon: twoTwoTwoTwoTwoTwo,
				sizes: [1, 1, 1, 1, 1, 1],
				content: generateDefaultColumns([1, 1, 1, 1, 1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},

	sevenColumns: {
		default: [
			{
				name: '7 columns',
				icon: sevenColumns,
				sizes: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
				responsiveLayout: '1-1-1-1-1-1-1',
				content: generateDefaultColumns([
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
				]),

				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
		responsive: [
			{
				name: '2-1-1-1-1-1-1',
				icon: twoOneOneOneOneOneOne,
				sizes: [1, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
				content: generateDefaultColumns(
					[1, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1-1-1-1-2',
				icon: oneOneOneOneOneOneTwo,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
				content: generateDefaultColumns(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1-1-1-1-1-3',
				icon: oneOneOneOneOneOneOneThree,
				sizes: [1, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3],
				content: generateDefaultColumns(
					[1, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '3-1-1-1-1-1-1-1',
				icon: threeOneOneOneOneOneOneOne,
				sizes: [1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1],
				content: generateDefaultColumns(
					[1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1-1-1-1-1',
				icon: oneOneOneOneOneOneOne,
				sizes: [1, 1, 1, 1, 1, 1, 1],
				content: generateDefaultColumns([1, 1, 1, 1, 1, 1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},

	eightColumns: {
		default: [
			{
				name: '8 columns',
				icon: eightColumns,
				sizes: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8],
				responsiveLayout: '2-2-2-2-2-2-2-2',
				content: generateDefaultColumns([
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
				]),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
		responsive: [
			{
				name: '1-1-1-1-1-1-1-1',
				icon: oneOneOneOneOneOneOneOne,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
				content: generateDefaultColumns(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
					true
				),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '2-2-2-2-2-2-2-2',
				icon: twoTwoTwoTwoTwoTwoTwoTwo,
				sizes: [1, 1, 1, 1, 1, 1, 1, 1],
				content: generateDefaultColumns([1, 1, 1, 1, 1, 1, 1], true),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},
};

export default columnTemplates;
