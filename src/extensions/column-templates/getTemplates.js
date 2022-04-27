/**
 * Internal dependencies
 */
import columnTemplates from './columnTemplates';

/**
 * Get templates based on the number of columns and device
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
		sevenColumns,
		eightColumns,
	} = columnTemplates;

	switch (columnsNumber) {
		case 1:
			return oneColumn.default.concat(oneColumn.responsive);

		case 2:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return twoColumns.default.concat(twoColumns.responsive);
			}
			return columnTemplates.twoColumns.default;

		case 3:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return threeColumns.default.concat(threeColumns.responsive);
			}
			return columnTemplates.threeColumns.default;

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
		case 7:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return sevenColumns.default.concat(sevenColumns.responsive);
			}
			return sevenColumns.default;
		case 8:
			if (responsiveSnappingScreens.includes(deviceType)) {
				return eightColumns.default.concat(eightColumns.responsive);
			}
			return eightColumns.default;

		default:
			return oneColumn.default.concat(
				twoColumns.default,
				threeColumns.default,
				fourColumns.default,
				fiveColumns.default,
				sixColumns.default,
				sevenColumns.default,
				eightColumns.default
			);
	}
}

export default getTemplates;
