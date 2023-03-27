const getButtonConstants = obj => {
	const newObj = { ...obj };

	delete newObj.bottomGap;

	return newObj;
};

export const generalTypographyStyle = {
	decoration: 'overline',
	weight: '300',
	transform: 'capitalize',
	style: 'italic',
	indent: '44',
	whiteSpace: 'pre',
	wordSpacing: '10',
	bottomGap: '20',
};
export const generalButtonTypographyStyle = getButtonConstants(
	generalTypographyStyle
);

export const responsiveTypographyStyle = {
	decoration: 'underline',
	weight: '400',
	transform: 'uppercase',
	style: 'oblique',
	indent: '22',
	whiteSpace: 'pre-wrap',
	wordSpacing: '20',
	bottomGap: '10',
};

export const responsiveButtonTypographyStyle = getButtonConstants(
	responsiveTypographyStyle
);

export const generalTypographyOptions = {
	size: '20',
	lineHeight: '10',
	letterSpacing: '5',
};

export const responsiveTypographyOptions = {
	size: '10',
	lineHeight: '20',
	letterSpacing: '15',
};
