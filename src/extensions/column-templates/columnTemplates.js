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
} from '@maxi-icons';

// Array of all templates
const columnTemplates = {
	oneColumn: {
		default: [
			{
				name: '1',
				icon: oneColumn,
				sizes: [1],
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
				sizes: [1 / 2, 1 / 2],
			},
			{
				name: '1-3',
				icon: oneThree,
				responsiveLayout: '2-2',
				sizes: [1 / 4, 3 / 4],
			},
			{
				name: '3-1',
				icon: threeOne,
				responsiveLayout: '2-2',
				sizes: [3 / 4, 1 / 4],
			},
			{
				name: '1-4',
				icon: oneFour,
				responsiveLayout: '2-2',
				sizes: [1 / 5, 4 / 5],
			},
			{
				name: '4-1',
				icon: fourOne,
				responsiveLayout: '2-2',
				sizes: [4 / 5, 1 / 5],
			},
		],
		responsive: [
			{
				name: '2-2',
				icon: twoTwo,
				sizes: [1, 1],
			},
		],
	},

	threeColumns: {
		default: [
			{
				name: '3 columns',
				icon: threeColumns,
				responsiveLayout: '1-1-1',
				sizes: [1 / 3, 1 / 3, 1 / 3],
			},
			{
				name: '1-1-3',
				icon: oneOneThree,
				responsiveLayout: '1-1-1',
				sizes: [1 / 5, 1 / 5, 3 / 5],
			},
			{
				name: '1-1-4',
				icon: oneOneFour,
				responsiveLayout: '1-1-1',
				sizes: [1 / 6, 1 / 6, 4 / 6],
			},
			{
				name: '1-4-1',
				icon: oneFourOne,
				responsiveLayout: '1-1-1',
				sizes: [1 / 6, 4 / 6, 1 / 6],
			},
			{
				name: '3-1-1',
				icon: threeOneOne,
				responsiveLayout: '1-1-1',
				sizes: [3 / 5, 1 / 5, 1 / 5],
			},
			{
				name: '4-1-1',
				icon: fourOneOne,
				responsiveLayout: '1-1-1',
				sizes: [4 / 6, 1 / 6, 1 / 6],
			},
		],
		responsive: [
			{
				name: '1-1-2',
				icon: oneOneTwo,
				sizes: [1 / 2, 1 / 2, 1],
			},
			{
				name: '1-2-2',
				icon: oneTwoTwo,
				sizes: [1, 1 / 2, 1 / 2],
			},
			{
				name: '1-1-1',
				icon: oneOneOne,
				sizes: [1, 1, 1],
			},
		],
	},

	fourColumns: {
		default: [
			{
				name: '4 columns',
				icon: fourColumns,
				responsiveLayout: '2-2-2-2',
				sizes: [1 / 4, 1 / 4, 1 / 4, 1 / 4],
			},
		],
		responsive: [
			{
				name: '1-1-1-1',
				icon: oneOneOneOne,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2],
			},
			{
				name: '2-1-1-2',
				icon: twoOneOneTwo,
				sizes: [1, 1 / 2, 1 / 2, 1],
			},
			{
				name: '1-1-2-2',
				icon: oneOneTwoTwo,
				sizes: [1 / 2, 1 / 2, 1, 1],
			},
			{
				name: '2-2-1-1',
				icon: twoTwoOneOne,
				sizes: [1, 1, 1 / 2, 1 / 2],
			},
			{
				name: '2-2-2-2',
				icon: twoTwoTwoTwo,
				sizes: [1, 1, 1, 1],
			},
		],
	},

	fiveColumns: {
		default: [
			{
				name: '5 columns',
				icon: fiveColumns,
				responsiveLayout: '1-1-1-1-1',
				sizes: [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5],
			},
		],
		responsive: [
			{
				name: '2-1-1-1-1',
				icon: twoOneOneOneOne,
				sizes: [1, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
			},
			{
				name: '1-1-2-1-1',
				icon: oneOneTwoOneOne,
				sizes: [1 / 2, 1 / 2, 1, 1 / 2, 1 / 2],
			},
			{
				name: '1-1-1-1-2',
				icon: oneOneOneOneTwo,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
			},
			{
				name: '1-1-1-1-1',
				icon: oneOneOneOneOne,
				sizes: [1, 1, 1, 1, 1],
			},
		],
	},

	sixColumns: {
		default: [
			{
				name: '6 columns',
				icon: sixColumns,
				responsiveLayout: '2-2-2-2-2-2',
				sizes: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
			},
		],
		responsive: [
			{
				name: '1-1-1-1-1-1',
				icon: oneOneOneOneOneOne,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
			},
			{
				name: '2-2-2-2-2-2',
				icon: twoTwoTwoTwoTwoTwo,
				sizes: [1, 1, 1, 1, 1, 1],
			},
		],
	},

	sevenColumns: {
		default: [
			{
				name: '7 columns',
				icon: sevenColumns,
				responsiveLayout: '1-1-1-1-1-1-1',
				sizes: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
			},
		],
		responsive: [
			{
				name: '2-1-1-1-1-1-1',
				icon: twoOneOneOneOneOneOne,
				sizes: [1, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
			},
			{
				name: '1-1-1-1-1-1-2',
				icon: oneOneOneOneOneOneTwo,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
			},
			{
				name: '1-1-1-1-1-1-1-3',
				icon: oneOneOneOneOneOneOneThree,
				sizes: [1, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3],
			},
			{
				name: '3-1-1-1-1-1-1-1',
				icon: threeOneOneOneOneOneOneOne,
				sizes: [1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1],
			},
			{
				name: '1-1-1-1-1-1-1',
				icon: oneOneOneOneOneOneOne,
				sizes: [1, 1, 1, 1, 1, 1, 1],
			},
		],
	},

	eightColumns: {
		default: [
			{
				name: '8 columns',
				icon: eightColumns,
				responsiveLayout: '2-2-2-2-2-2-2-2',
				sizes: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8],
			},
		],
		responsive: [
			{
				name: '1-1-1-1-1-1-1-1',
				icon: oneOneOneOneOneOneOneOne,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
			},
			{
				name: '2-2-2-2-2-2-2-2',
				icon: twoTwoTwoTwoTwoTwoTwoTwo,
				sizes: [1, 1, 1, 1, 1, 1, 1, 1],
			},
		],
	},
	moreThanEightColumns: {
		default: [
			{
				name: 'more than 8 columns',
				isMoreThanEightColumns: true,
			},
		],
		responsive: [],
	},
};

export default columnTemplates;
