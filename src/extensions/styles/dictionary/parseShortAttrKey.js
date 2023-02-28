import { reversedDictionary } from './attributesDictionary';

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Parse short key to long one
 *
 * @param {*} attrKey
 * @returns
 */
const parseShortAttrKey = attrKey => {
	let cleanedKey = attrKey;

	let isHover = false;
	let breakpoint;

	if (attrKey.includes('-hover')) {
		isHover = true;
		cleanedKey = attrKey.replace('-hover', '');
	}
	if (breakpoints.some(bp => attrKey.includes(`-${bp}`))) {
		breakpoint = breakpoints.find(bp => attrKey.includes(`-${bp}`));
		cleanedKey = attrKey.replace(`-${breakpoint}`, '');
	}

	const longerKey = reversedDictionary[cleanedKey];

	if (!longerKey) return attrKey;

	const response = `${longerKey}${breakpoint ? `-${breakpoint}` : ''}${
		isHover ? '-hover' : ''
	}`;

	return response;
};

export default parseShortAttrKey;
