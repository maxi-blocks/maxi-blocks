/**
 * External dependencies
 */
import { isObject, isEmpty } from 'lodash';

const hoverStylesCleaner = (normalObj, hoverObj) => {
	if (normalObj)
		Object.entries(normalObj).forEach(([key, val]) => {
			if (key in hoverObj)
				Object.entries(val).forEach(([breakpoint, breakpointVal]) => {
					if (breakpoint in hoverObj[key])
						Object.entries(breakpointVal).forEach(
							([attrKey, attrVal]) => {
								if (
									attrKey in hoverObj[key][breakpoint] &&
									hoverObj[key][breakpoint][attrKey] ===
										attrVal
								)
									delete hoverObj[key][breakpoint][attrKey];
							}
						);
				});
		});

	return hoverObj;
};

const stylesCleaner = obj => {
	Object.entries(obj).forEach(([key, val]) => {
		// Clean non-object ones
		Object.entries(val).forEach(([typeKey, typeVal]) => {
			if (!isObject(typeVal) || isEmpty(typeVal))
				delete obj[key][typeKey];
			// Clean empty objects
			else
				Object.entries(typeVal).forEach(
					([breakpoint, breakpointVal]) => {
						if (!isObject(breakpointVal) || isEmpty(breakpointVal))
							delete obj[key][typeKey][breakpoint];
					}
				);
		});

		// Clean hover values
		if (key.includes(':hover')) {
			const normalKey = key.replace(':hover', '');

			obj[key] = hoverStylesCleaner(obj[normalKey], val);
		}
	});

	return obj;
};

export default stylesCleaner;
