import { noTypeDictionary } from './attributesDictionary';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Parse long key to short one
 *
 * @param {*} attrKey
 * @returns
 */
const parseLongAttrKey = attrKey => {
	if (!attrKey) return null;

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

	const shorterKey = noTypeDictionary[cleanedKey];

	if (!shorterKey) return attrKey;

	const response = `${shorterKey}${breakpoint ? `-${breakpoint}` : ''}${
		isHover ? '-hover' : ''
	}`;

	return response;
};

export default parseLongAttrKey;
