import getBlockAttributes from './getBlockAttributes';

const getBlockStyle = async page => {
	const { uniqueID } = await getBlockAttributes();

	const stylesString = await page.$eval(
		'#maxi-blocks__consolidated-styles',
		(style, blockUniqueID) => {
			// Extract only the styles for this specific block
			let allStyles = style.innerHTML;

			// First try marker-based extraction to preserve nested structures
			const startMarker = `/* Block: ${blockUniqueID} */`;
			const startMarkerIndex = allStyles.indexOf(startMarker);

			if (startMarkerIndex !== -1) {
				// Find the start of the CSS content after the marker
				const cssStartIndex = startMarkerIndex + startMarker.length;

				// Find the next block marker to determine the end
				const nextMarkerRegex = /\/\* Block: [^*]+ \*\//g;
				nextMarkerRegex.lastIndex = cssStartIndex;
				const nextMarkerMatch = nextMarkerRegex.exec(allStyles);

				let cssEndIndex;
				if (nextMarkerMatch) {
					// End at the next block marker
					cssEndIndex = nextMarkerMatch.index;
				} else {
					// If no next marker, take everything to the end
					cssEndIndex = allStyles.length;
				}

				// Extract the CSS between markers (excluding the start marker)
				let result = allStyles.slice(cssStartIndex, cssEndIndex);

				// Remove leading/trailing whitespace and extra newlines
				result = result.trim();

				return result;
			}

			// Fallback: Use regex extraction if markers are absent
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
