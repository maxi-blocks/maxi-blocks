import getBlockAttributes from './getBlockAttributes';
import changeResponsive from './changeResponsive';

const getBlockStyle = async page => {
	await changeResponsive(page, 'xs');

	const { uniqueID } = await getBlockAttributes();

	const stylesString = await page.$eval(
		`#maxi-blocks__styles--${uniqueID}`,
		style => style.innerHTML
	);

	await changeResponsive(page, 'base');

	return stylesString;
};

export default getBlockStyle;
