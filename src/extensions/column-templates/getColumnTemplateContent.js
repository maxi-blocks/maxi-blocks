/**
 *  Internal dependencies
 */
import columnAttributesGenerator from './columnsAttributesGenerator';

/**
 * Generates an array of column properties to add inside a Row Maxi
 *
 * @param {Array} 	columns			Distribution and number of columns
 *
 * @returns {Array} New columns distribution and attributes
 */
const getColumnTemplateContent = (columns, removeColumnGap, breakpoint) => {
	const newAttributes = columnAttributesGenerator(
		columns,
		removeColumnGap,
		breakpoint
	);

	return newAttributes.map(colAttr => {
		return ['maxi-blocks/column-maxi', { ...colAttr }];
	});
};

export default getColumnTemplateContent;
