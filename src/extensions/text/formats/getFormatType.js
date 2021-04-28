/**
 * Generates custom format name
 *
 * @param {boolean} isHover 			Is the requested typography under hover state
 *
 * @returns {string} Custom format name
 */
const getFormatType = isHover => {
	return `maxi-blocks/text-custom${isHover ? '-hover' : ''}`;
};

export default getFormatType;
