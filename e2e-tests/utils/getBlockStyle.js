import getBlockAttributes from './getBlockAttributes';
import changeResponsive from './changeResponsive';

const getBlockStyle = async page => {
	changeResponsive(page, 'xs');

	const { uniqueID } = await getBlockAttributes();

	const stylesString = await page.$eval(
		`#maxi-blocks__styles--${uniqueID}`,
		style => style.innerHTML
	);

	return stylesString;
};

export default getBlockStyle;
