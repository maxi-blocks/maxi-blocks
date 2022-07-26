/**
 * Expects element and name of attribute, returns attribute of the html element
 *
 * @param {any}    element
 * @param {string} attribute
 */
const getElementAttribute = async (element, attribute) => {
	return (await element.getProperty(attribute)).jsonValue();
};

export default getElementAttribute;
