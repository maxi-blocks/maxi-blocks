const getHasNativeFormat = (formatValue, isHover) => {
	const { formats, start, end } = formatValue;

	return formats.some((formatEl, i) => {
		if (formatEl)
			return formatEl.some(format => {
				return format.type.includes('core') && i <= start && i <= end;
			});

		return formatEl;
	});
};

export default getHasNativeFormat;
