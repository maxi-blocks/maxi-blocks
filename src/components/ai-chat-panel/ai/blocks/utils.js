export const parseBorderStyle = borderStyle => {
	if (typeof borderStyle !== 'string') return null;
	const [style, widthValue] = borderStyle.split('-');
	if (!style || !widthValue) return null;
	const width = parseInt(widthValue.replace('px', ''), 10);
	if (Number.isNaN(width)) return null;
	return { style, width };
};
