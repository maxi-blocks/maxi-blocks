import getBlockAttributes from './getBlockAttributes';

const getBlockStyle = async page => {
	const { _uid: uniqueID } = await getBlockAttributes();

	const stylesString = await page.$eval(
		`#maxi-blocks__styles--${uniqueID}`,
		style => style.innerHTML
	);

	return stylesString;
};

export default getBlockStyle;
