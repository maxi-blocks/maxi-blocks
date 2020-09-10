const isFormattedWithType = (format, type) => {
	return format.formats.some(formatEl => {
		return formatEl.some(format => {
			return format.type === type;
		});
	});
};

const setFormatForMaxi = format => {
	const isLinkFormatted = isFormattedWithType(format, 'core/link');

	if(!isLinkFormatted)

};

export default setFormatForMaxi;
