import getBlockAttributes from './getBlockAttributes';

const getBlockStyle = async page => {
	const { uniqueID } = await getBlockAttributes();

	const stylesString = await page.$eval(
		'#maxi-blocks__consolidated-styles',
		(style, blockUniqueID) => {
			// Extract only the styles for this specific block
			let allStyles = style.innerHTML;

			// Remove CSS comments like /* Block: group-maxi-1se8ef1z-u */
			allStyles = allStyles.replace(
				/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g,
				''
			);

			// Match complete CSS rules that contain the block's unique ID
			// This regex matches: selector{...} where selector contains the uniqueID
			const regex = new RegExp(
				`[^}]*${blockUniqueID}[^{]*\\{[^}]*\\}`,
				'gs'
			);
			const blockStyles = allStyles.match(regex) || [];

			// Join and clean up the result
			let result = blockStyles.join('');

			// Remove leading/trailing whitespace and extra newlines
			result = result.trim();

			return result;
		},
		uniqueID
	);

	return stylesString;
};

export default getBlockStyle;
