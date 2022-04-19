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
} from '../../icons';
import getColumnTemplateContent from './getColumnTemplateContent';

const getColumnContent = (columns, breakpoint) => {
	return {
		sizes: columns,
		content: getColumnTemplateContent(columns, breakpoint),
		attributes: {
			'flex-wrap-general': 'nowrap',
			'flex-wrap-m': 'wrap',
		},
	};
};

// Array of all templates
const columnTemplates = {
	oneColumn: {
		default: [
			{
				name: '1',
				icon: oneColumn,
				...getColumnContent([1]),
			},
		],
		responsive: [],
	},

	twoColumns: {
		default: [
			{
				name: '1-1',
				icon: twoColumns,
				responsiveLayout: '2-2',
				...getColumnContent([1 / 2, 1 / 2]),
			},
			{
				name: '1-3',
				icon: oneThree,
				responsiveLayout: '2-2',
				...getColumnContent([1 / 4, 3 / 4]),
			},
			{
				name: '3-1',
				icon: threeOne,
				responsiveLayout: '2-2',
				...getColumnContent([3 / 4, 1 / 4]),
			},
			{
				name: '1-4',
				icon: oneFour,
				responsiveLayout: '2-2',
				...getColumnContent([1 / 5, 4 / 5]),
			},
			{
				name: '4-1',
				icon: fourOne,
				responsiveLayout: '2-2',
				...getColumnContent([4 / 5, 1 / 5]),
			},
		],
		responsive: [
			{
				name: '2-2',
				icon: twoTwo,
				...getColumnContent([1, 1], 'm'),
			},
		],
	},

	threeColumns: {
		default: [
			{
				name: '3 columns',
				icon: threeColumns,
				responsiveLayout: '1-1-1',
				...getColumnContent([1 / 3, 1 / 3, 1 / 3]),
			},
			{
				name: '1-1-3',
				icon: oneOneThree,
				responsiveLayout: '1-1-1',
				...getColumnContent([1 / 5, 1 / 5, 3 / 5]),
			},
			{
				name: '1-1-4',
				icon: oneOneFour,
				responsiveLayout: '1-1-1',
				...getColumnContent([1 / 6, 1 / 6, 4 / 6]),
			},
			{
				name: '1-4-1',
				icon: oneFourOne,
				responsiveLayout: '1-1-1',
				...getColumnContent([1 / 6, 4 / 6, 1 / 6]),
			},
			{
				name: '3-1-1',
				icon: threeOneOne,
				responsiveLayout: '1-1-1',
				...getColumnContent([3 / 5, 1 / 5, 1 / 5]),
			},
			{
				name: '4-1-1',
				icon: fourOneOne,
				responsiveLayout: '1-1-1',
				...getColumnContent([4 / 6, 1 / 6, 1 / 6]),
			},
		],
		responsive: [
			{
				name: '1-1-2',
				icon: oneOneTwo,
				...getColumnContent([1 / 2, 1 / 2, 1], 'm'),
			},
			{
				name: '1-2-2',
				icon: oneTwoTwo,
				...getColumnContent([1, 1 / 2, 1 / 2], 'm'),
			},
			{
				name: '1-1-1',
				icon: oneOneOne,
				...getColumnContent([1, 1, 1], 'm'),
			},
		],
	},

	fourColumns: {
		default: [
			{
				name: '4 columns',
				icon: fourColumns,
				responsiveLayout: '2-2-2-2',
				...getColumnContent([1 / 4, 1 / 4, 1 / 4, 1 / 4]),
			},
		],
		responsive: [
			{
				name: '1-1-1-1',
				icon: oneOneOneOne,
				...getColumnContent([1 / 2, 1 / 2, 1 / 2, 1 / 2], 'm'),
			},
			{
				name: '2-1-1-2',
				icon: twoOneOneTwo,
				...getColumnContent([1, 1 / 2, 1 / 2, 1], 'm'),
			},
			{
				name: '1-1-2-2',
				icon: oneOneTwoTwo,
				...getColumnContent([1 / 2, 1 / 2, 1, 1], 'm'),
			},
			{
				name: '2-2-1-1',
				icon: twoTwoOneOne,
				...getColumnContent([1, 1, 1 / 2, 1 / 2], 'm'),
			},
			{
				name: '2-2-2-2',
				icon: twoTwoTwoTwo,
				...getColumnContent([1, 1, 1, 1], 'm'),
			},
		],
	},

	fiveColumns: {
		default: [
			{
				name: '5 columns',
				icon: fiveColumns,
				responsiveLayout: '1-1-1-1-1',
				...getColumnContent([1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5]),
			},
		],
		responsive: [
			{
				name: '2-1-1-1-1',
				icon: twoOneOneOneOne,
				...getColumnContent([1, 1 / 2, 1 / 2, 1 / 2, 1 / 2], 'm'),
			},
			{
				name: '1-1-2-1-1',
				icon: oneOneTwoOneOne,
				...getColumnContent([1 / 2, 1 / 2, 1, 1 / 2, 1 / 2], 'm'),
			},
			{
				name: '1-1-1-1-2',
				icon: oneOneOneOneTwo,
				...getColumnContent([1 / 2, 1 / 2, 1 / 2, 1 / 2, 1], 'm'),
			},
			{
				name: '1-1-1-1-1',
				icon: oneOneOneOneOne,
				...getColumnContent([1, 1, 1, 1, 1], 'm'),
			},
		],
	},

	sixColumns: {
		default: [
			{
				name: '6 columns',
				icon: sixColumns,
				responsiveLayout: '2-2-2-2-2-2',
				...getColumnContent([1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]),
			},
		],
		responsive: [
			{
				name: '1-1-1-1-1-1',
				icon: oneOneOneOneOneOne,
				...getColumnContent(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
					'm'
				),
			},
			{
				name: '2-2-2-2-2-2',
				icon: twoTwoTwoTwoTwoTwo,
				...getColumnContent([1, 1, 1, 1, 1, 1], 'm'),
			},
		],
	},

	sevenColumns: {
		default: [
			{
				name: '7 columns',
				icon: sevenColumns,
				responsiveLayout: '1-1-1-1-1-1-1',
				...getColumnContent([
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
					1 / 7,
				]),
			},
		],
		responsive: [
			{
				name: '2-1-1-1-1-1-1',
				icon: twoOneOneOneOneOneOne,
				...getColumnContent(
					[1, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
					'm'
				),
			},
			{
				name: '1-1-1-1-1-1-2',
				icon: oneOneOneOneOneOneTwo,
				...getColumnContent(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
					'm'
				),
			},
			{
				name: '1-1-1-1-1-1-1-3',
				icon: oneOneOneOneOneOneOneThree,
				...getColumnContent(
					[1, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3],
					'm'
				),
			},
			{
				name: '3-1-1-1-1-1-1-1',
				icon: threeOneOneOneOneOneOneOne,
				...getColumnContent(
					[1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1],
					'm'
				),
			},
			{
				name: '1-1-1-1-1-1-1',
				icon: oneOneOneOneOneOneOne,
				...getColumnContent([1, 1, 1, 1, 1, 1, 1], 'm'),
			},
		],
	},

	eightColumns: {
		default: [
			{
				name: '8 columns',
				icon: eightColumns,
				responsiveLayout: '2-2-2-2-2-2-2-2',
				...getColumnContent([
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
					1 / 8,
				]),
			},
		],
		responsive: [
			{
				name: '1-1-1-1-1-1-1-1',
				icon: oneOneOneOneOneOneOneOne,
				...getColumnContent(
					[1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
					'm'
				),
			},
			{
				name: '2-2-2-2-2-2-2-2',
				icon: twoTwoTwoTwoTwoTwoTwoTwo,
				...getColumnContent([1, 1, 1, 1, 1, 1, 1, 1], 'm'),
			},
		],
	},
};

export default columnTemplates;
