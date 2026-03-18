/**
 * Internal dependencies
 */
import { getIsValid } from './utils';
import * as defaults from './defaults/index';

// WeakMap-based cache: keyed by the attributes object reference.
// When React creates a new attributes object (on any prop change) the entry is
// automatically out-of-scope and eligible for GC, so there is no stale-data risk.
// Within a single getStylesObject() call all repeated getGroupAttributes() calls
// with the same args (e.g. 'clipPath' ×6 in image-maxi) are served from cache.
const _cache = new WeakMap();

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false
) => {
	if (!target) return null;

	// Build a cheap string key from the non-object arguments.
	const cacheKey = `${Array.isArray(target) ? target.join(',') : target}|${isHover ? 1 : 0}|${prefix}|${cleaned ? 1 : 0}`;

	let attrCache = _cache.get(attributes);
	if (attrCache) {
		const hit = attrCache.get(cacheKey);
		if (hit !== undefined) return hit;
	} else {
		attrCache = new Map();
		_cache.set(attributes, attrCache);
	}

	const response = {};

	if (isHover) {
		Object.assign(
			response,
			getGroupAttributes(attributes, target, false, prefix, cleaned)
		);
	}

	const processTarget = el => {
		const defaultAttributes =
			defaults[`${el}${isHover ? 'Hover' : ''}`] || defaults[el];
		if (defaultAttributes) {
			Object.keys(defaultAttributes).forEach(key => {
				if (getIsValid(attributes[`${prefix}${key}`], cleaned)) {
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
				}
			});
		}
	};

	if (typeof target === 'string') {
		processTarget(target);
	} else {
		target.forEach(el => processTarget(el));
	}

	attrCache.set(cacheKey, response);
	return response;
};

export default getGroupAttributes;
