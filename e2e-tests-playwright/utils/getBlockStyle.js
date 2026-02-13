import getBlockAttributes from './getBlockAttributes';

const getBlockStyle = async page => {
	const { uniqueID } = await getBlockAttributes(page);

	const stylesString = await page.$eval(
		'#maxi-blocks__consolidated-styles',
		(style, blockUniqueID) => {
			let allStyles = style.innerHTML;

			const startMarker = `/* Block: ${blockUniqueID} */`;
			const startMarkerIndex = allStyles.indexOf(startMarker);

			if (startMarkerIndex !== -1) {
				const cssStartIndex = startMarkerIndex + startMarker.length;

				const nextMarkerRegex = /\/\* Block: [^*]+ \*\//g;
				nextMarkerRegex.lastIndex = cssStartIndex;
				const nextMarkerMatch = nextMarkerRegex.exec(allStyles);

				const cssEndIndex = nextMarkerMatch
					? nextMarkerMatch.index
					: allStyles.length;

				return allStyles.slice(cssStartIndex, cssEndIndex).trim();
			}

			// Fallback: remove comments and extract rules containing the unique id
			allStyles = allStyles.replace(
				/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g,
				''
			);

			const regex = new RegExp(
				`[^}]*${blockUniqueID}[^{]*\\{[^}]*\\}`,
				'gs'
			);
			const blockStyles = allStyles.match(regex) || [];

			return blockStyles.join('').trim();
		},
		uniqueID
	);

	return stylesString;
};

export default getBlockStyle;
