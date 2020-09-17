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
 * WordPress Dependencies
 */
const { dispatch } = wp.data;

const { updateBlockAttributes } = dispatch('core/block-editor');

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
					'margin-top': i !== 0 ? 1 : '',
					'margin-right': '',
					'margin-bottom': '',
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

// Array of all templates
const templates = {
	oneColumn: {
		default: [
			{
				name: '1',
				icon: oneColumn,
				sizes: [1],
				spacing: [''],
				rowLengths: [1],
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
				spacing: ['gap', 'gap'],
				rowLengths: [2, 2],
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
				spacing: ['gap', 'gap'],
				rowLengths: [2, 2],
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
				spacing: ['gap', 'gap'],
				rowLengths: [2, 2],
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
				spacing: ['gap', 'gap'],
				rowLengths: [2, 2],
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
				spacing: ['gap', 'gap'],
				rowLengths: [2, 2],
				content: generateDefaultColumns([4 / 5, 1 / 5]),
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
		responsive: [],
	},

	threeColumns: {
		default: [
			{
				name: '3 columns',
				icon: threeColumns,
				sizes: [1 / 3, 1 / 3, 1 / 3],
				spacing: ['gap', 'gap', 'gap'],
				rowLengths: [3, 3, 3],
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
				spacing: ['gap', 'gap', 'gap'],
				rowLengths: [3, 3, 3],
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
				spacing: ['gap', 'gap', 'gap'],
				rowLengths: [3, 3, 3],
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
				spacing: ['gap', 'gap', 'gap'],
				rowLengths: [3, 3, 3],
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
				spacing: ['gap', 'gap', 'gap'],
				rowLengths: [3, 3, 3],
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
				spacing: ['gap', 'gap', 'gap'],
				rowLengths: [3, 3, 3],
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
				spacing: ['gap', 'gap', 'marginTop'],
				rowLengths: [2, 2, 1],
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
				spacing: ['', 'marginTop', 'marginTop'],
				rowLengths: [1, 1, 1],
				content: generateDefaultColumns([1, 1, 1]),
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
				spacing: ['gap', 'gap', 'gap', 'gap'],
				rowLengths: [4, 4, 4, 4],
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
				spacing: ['gap', 'gap', 'gap-marginTop', 'gap-marginTop'],
				rowLengths: [2, 2, 2, 2],
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
				spacing: ['', 'gap-marginTop', 'gap-marginTop', 'marginTop'],
				rowLengths: [1, 2, 2, 1],
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
				spacing: ['gap', 'gap', 'marginTop', 'marginTop'],
				rowLengths: [2, 2, 1, 1],
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
				spacing: ['', 'marginTop', 'gap-marginTop', 'gap-marginTop'],
				rowLengths: [1, 1, 2, 2],
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
				spacing: ['', 'marginTop', 'marginTop', 'marginTop'],
				rowLengths: [1, 1, 1, 1],
				content: generateDefaultColumns([1, 1, 1, 1]),
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
				spacing: ['gap', 'gap', 'gap', 'gap'],
				content: generateDefaultColumns([
					1 / 5,
					1 / 5,
					1 / 5,
					1 / 5,
					1 / 5,
				]),
				rowLengths: [5, 5, 5, 5, 5],
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
				content: generateDefaultColumns([
					1,
					1 / 2,
					1 / 2,
					1 / 2,
					1 / 2,
				]),
				spacing: [
					'',
					'gap-marginTop',
					'gap-marginTop',
					'gap-marginTop',
					'gap-marginTop',
				],
				rowLengths: [1, 2, 2, 2, 2],
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-2-1-1',
				icon: oneOneTwoOneOne,
				sizes: [1 / 2, 1 / 2, 1, 1 / 2, 1 / 2],
				content: generateDefaultColumns([
					1 / 2,
					1 / 2,
					1,
					1 / 2,
					1 / 2,
				]),
				spacing: [
					'gap',
					'gap',
					'marginTop',
					'gap-marginTop',
					'gap-marginTop',
				],
				rowLengths: [2, 2, 1, 2, 2],
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1-1-2',
				icon: oneOneOneOneTwo,
				sizes: [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1],
				content: generateDefaultColumns([
					1 / 2,
					1 / 2,
					1 / 2,
					1 / 2,
					1,
				]),
				spacing: [
					'gap',
					'gap',
					'gap-marginTop',
					'gap-marginTop',
					'marginTop',
				],
				rowLengths: [2, 2, 2, 2, 1],
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
			{
				name: '1-1-1-1-1',
				icon: oneOneOneOneOne,
				sizes: [1, 1, 1, 1, 1],
				spacing: [
					'',
					'marginTop',
					'marginTop',
					'marginTop',
					'marginTop',
				],
				rowLengths: [1, 1, 1, 1, 1],
				content: generateDefaultColumns([1, 1, 1, 1, 1]),
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
				spacing: ['gap', 'gap', 'gap', 'gap', 'gap', 'gap'],
				content: generateDefaultColumns([
					1 / 6,
					1 / 6,
					1 / 6,
					1 / 6,
					1 / 6,
					1 / 6,
				]),
				rowLengths: [6, 6, 6, 6, 6, 6],
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
				spacing: [
					'gap',
					'gap',
					'gap-marginTop',
					'gap-marginTop',
					'gap-marginTop',
					'gap-marginTop',
				],
				content: generateDefaultColumns([
					1 / 2,
					1 / 2,
					1 / 2,
					1 / 2,
					1 / 2,
				]),
				rowLengths: [2, 2, 2, 2, 2, 2],
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
				spacing: [
					'',
					'marginTop',
					'marginTop',
					'marginTop',
					'marginTop',
					'marginTop',
				],
				rowLengths: [1, 1, 1, 1, 1, 1],
				attributes: {
					horizontalAlign: 'space-between',
					verticalAlign: 'stretch',
				},
			},
		],
	},
};

/**
 * Get Template Object
 *
 * @param {string} templateName Name of template
 * @return {Object} template Object
 */
function getTemplateObject(templateName) {
	const allTemplates = [];

	Object.values(templates).forEach(value => {
		value.default.forEach(template => {
			allTemplates.push(template);
		});

		value.responsive.forEach(template => {
			allTemplates.push(template);
		});
	});

	const template = allTemplates.find(
		template => template.name === templateName
	);

	return template;
}

/**
 * Get columns Number based on the template name
 *
 * @param {string} tempalteName name of the template
 * @return {Integer} Number of Columns for the corresponding template
 */
function getNumCol(templateName) {
	const template = getTemplateObject(templateName);

	return template.sizes.length;
}

/**
 * Set Row Pattern Attribute
 *
 * @param {string} clientId client id of the row block
 * @param {string} rowPatternAttribute the row pattern attribute
 * @param {string} rowPatternAttributeName the row pattern attribute name
 * @param {string} templateName the template name to set
 * @return {Object} Block Object
 *
 */
function setRowPatternAttribute(
	clientId,
	rowPatternAttribute,
	rowPatternAttributeName,
	templateName,
	deviceType
) {
	const largeDevices = ['general', 'xxl', 'xl', 'l', 'm'];

	const smallDevices = ['s', 'xs'];

	const rowPatternObject = JSON.parse(rowPatternAttribute);

	const numCols = getNumCol(templateName);
	const templatesValues = Object.values(templates);

	if (largeDevices.includes(deviceType)) {
		for (const device of largeDevices) {
			rowPatternObject[device].rowPattern = templateName;
		}

		// set stacked template for small screens
		const stackedTemplateIndex =
			templatesValues[numCols - 1].responsive.length - 1;
		if (stackedTemplateIndex !== -1) {
			const stackedTemplate =
				templatesValues[numCols - 1].responsive[stackedTemplateIndex];

			for (const device of smallDevices) {
				rowPatternObject[device].rowPattern = stackedTemplate.name;
			}
		}
	}

	updateBlockAttributes(clientId, {
		[rowPatternAttributeName]: JSON.stringify(rowPatternObject),
	});

	return rowPatternObject;
}

/**
 * get templates based on the number of columns and device
 *
 * @param {Integer} columnsNumber Number of columns
 * @return {Array} Array of templates for the corresponding columns number
 */
function getTemplates(deviceType = 'general', columnsNumber = undefined) {
	const responsiveSnappingScreens = ['m', 's', 'xs'];

	const {
		oneColumn,
		twoColumns,
		threeColumns,
		fourColumns,
		fiveColumns,
		sixColumns,
	} = templates;

	switch (columnsNumber) {
		case 1:
			return oneColumn.default.concat(oneColumn.responsive);

		case 2:
			return twoColumns.default.concat(twoColumns.responsive);

		case 3:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return threeColumns.default.concat(threeColumns.responsive);
			}
			return templates.threeColumns.default;

		case 4:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return fourColumns.default.concat(fourColumns.responsive);
			}
			return fourColumns.default;

		case 5:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return fiveColumns.default.concat(fiveColumns.responsive);
			}
			return fiveColumns.default;
		case 6:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return sixColumns.default.concat(sixColumns.responsive);
			}
			return sixColumns.default;

		default:
			return oneColumn.default.concat(
				twoColumns.default,
				threeColumns.default,
				fourColumns.default,
				fiveColumns.default,
				sixColumns.default
			);
	}
}

export { getTemplates, getTemplateObject, getNumCol, setRowPatternAttribute };
