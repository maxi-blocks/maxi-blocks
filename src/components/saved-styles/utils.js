export const getRenamedSavedStyles = ({
	savedStyles,
	selectedStyle,
	newName,
}) => {
	if (!savedStyles || !selectedStyle || !newName) return null;

	const currentStyles = { ...savedStyles };

	if (
		newName !== selectedStyle &&
		Object.prototype.hasOwnProperty.call(currentStyles, newName)
	)
		return null;

	const styleData = currentStyles[selectedStyle];
	delete currentStyles[selectedStyle];
	currentStyles[newName] = styleData;

	return currentStyles;
};
