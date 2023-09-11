const uniqueIDGenerator = ({ blockName, oldUniqueID }) => {
	const name = blockName
		.replace('maxi-blocks/', '')
		.replace(/ /g, '-')
		.toLowerCase();

	// Extract the numeric part after the last hyphen
	const match = oldUniqueID ? oldUniqueID.match(/-(\d+)$/) : null;
	const lastNumber = match ? match[1] : '1';

	// Determine the unique part based on the extracted number
	const uniquePart = `${lastNumber}se8ef1z`;

	return `${name}-${uniquePart}-u`;
};

export default uniqueIDGenerator;
