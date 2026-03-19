/**
 * Internal dependencies
 */
import { getIsValid } from './utils';
import * as defaults from './defaults/index';

// WeakMap-based cache: keyed by the attributes object reference.
// Caching is only enabled when cleaned=true to avoid stale cache issues with in-place
// attribute mutations that can occur in the codebase.
//
// Note: When cleaned=false (the default), attributes may be mutated in place during
// the rendering cycle, causing the WeakMap to return stale cached results even though
// attribute values have changed. By only caching when cleaned=true, we maintain correctness
// while still providing performance benefits for the cleaned attribute extraction path.
const _cache = new WeakMap();

/**
 * Creates a validation key by hashing relevant attribute values
 * Includes both presence and actual values of attributes for accurate cache invalidation
 */
const createValidationKey = (attributes, defaultKeys, prefix) => {
	// Create a string that includes both presence and values
	// Only check first 30 keys for performance (balance between accuracy and speed)
	const sample = defaultKeys.slice(0, 30);
	return sample.map(k => {
		const val = attributes[`${prefix}${k}`];
		if (val === undefined) return '0';
		// For defined values, include a simple hash
		return `1:${typeof val}:${String(val).slice(0, 10)}`;
	}).join('|');
};

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false
) => {
	if (!target) return null;

	// Only enable WeakMap caching when cleaned=true
	// When cleaned=false (default), attributes may be mutated in place, causing stale caches
	const enableCache = cleaned;

	// Build cache key from the non-object arguments
	const cacheKey = `${Array.isArray(target) ? target.join(',') : target}|${isHover ? 1 : 0}|${prefix}|${cleaned ? 1 : 0}`;

	// Get default attributes to use for validation
	const targets = Array.isArray(target) ? target : [target];
	const allDefaultKeys = [];
	targets.forEach(el => {
		const defaultAttributes =
			defaults[`${el}${isHover ? 'Hover' : ''}`] || defaults[el];
		if (defaultAttributes) {
			allDefaultKeys.push(...Object.keys(defaultAttributes));
		}
	});

	if (enableCache) {
		let attrCache = _cache.get(attributes);
		if (attrCache) {
			const cached = attrCache.get(cacheKey);
			if (cached) {
				// Validate the cache is still accurate
				const currentValidation = createValidationKey(attributes, allDefaultKeys, prefix);
				if (currentValidation === cached.validation) {
					return cached.result;
				}
				// Cache is stale, invalidate and recompute
			}
		} else {
			attrCache = new Map();
			_cache.set(attributes, attrCache);
		}
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

	// Cache the result (only if caching is enabled)
	if (enableCache) {
		let attrCache = _cache.get(attributes);
		if (!attrCache) {
			attrCache = new Map();
			_cache.set(attributes, attrCache);
		}
		const validation = createValidationKey(attributes, allDefaultKeys, prefix);
		attrCache.set(cacheKey, { result: response, validation });
	}

	return response;
};

export default getGroupAttributes;
