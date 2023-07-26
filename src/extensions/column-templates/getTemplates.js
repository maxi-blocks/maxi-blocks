/**
 * Internal dependencies
 */
import columnTemplates from './columnTemplates';

/**
 * Get templates based on the number of columns and device
 *
 * @param {boolean} onlyEqualColumns Whether to return only templates with equal columns
 * @param {Integer} columnsNumber    Number of columns
 * @return {Array} Array of templates for the corresponding columns number
 */
function getTemplates(
	onlyEqualColumns = false,
	deviceType = 'general',
	columnsNumber = undefined
) {
	const responsiveSnappingScreens = ['m', 's', 'xs'];

	const {
		oneColumn,
		twoColumns,
		threeColumns,
		fourColumns,
		fiveColumns,
		sixColumns,
		sevenColumns,
		eightColumns,
		moreThanEightColumns,
	} = columnTemplates;

	const getResponsiveOrDefault = columnObject => {
		if (responsiveSnappingScreens.includes(deviceType)) {
			return columnObject.default.concat(columnObject.responsive);
		}
		return columnObject.default;
	};

	const getTemplatesByColumnsNumber = () => {
		switch (columnsNumber) {
			case 1:
				return oneColumn.default.concat(oneColumn.responsive);
			case 2:
				return getResponsiveOrDefault(twoColumns);
			case 3:
				return getResponsiveOrDefault(threeColumns);
			case 4:
				return getResponsiveOrDefault(fourColumns);
			case 5:
				return getResponsiveOrDefault(fiveColumns);
			case 6:
				return getResponsiveOrDefault(sixColumns);
			case 7:
				return getResponsiveOrDefault(sevenColumns);
			case 8:
				return getResponsiveOrDefault(eightColumns);
			case undefined:
				return oneColumn.default.concat(
					twoColumns.default,
					threeColumns.default,
					fourColumns.default,
					fiveColumns.default,
					sixColumns.default,
					sevenColumns.default,
					eightColumns.default
				);
			default:
				return moreThanEightColumns.default;
		}
	};

	let templates = getTemplatesByColumnsNumber();

	if (onlyEqualColumns) {
		templates = templates.filter(template => {
			if (template.isMoreThanEightColumns) {
				return true;
			}

			const { sizes } = template;
			const firstSize = sizes[0];
			return sizes.every(size => size === firstSize);
		});
	}

	return templates;
}

export default getTemplates;
