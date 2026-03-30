/**
 * Internal dependencies
 */
import { getIsValid } from './utils';
import * as defaults from './defaults/index';

// WeakMap-based cache: keyed by the attributes object reference.
// Cache validation uses two-layer approach:
// 1. Generation counter (__cacheGeneration) - incremented by updateAttributes() in maxiBlockComponent
// 2. Value sampling - checks first 30 attribute values for changes
//
// This approach handles in-place mutations safely because the generation counter
// is incremented on every updateAttributes() call, which all attribute mutations now use.
const _cache = new WeakMap();

/**
 * Creates a validation key by checking attribute values with generation counter
 * The generation counter is incremented by updateAttributes() to invalidate caches
 * Also samples first 30 attribute keys for value-based validation
 */
const createValidationKey = (attributes, defaultKeys, prefix) => {
	// Include generation counter from attributes object
	// This counter is incremented by updateAttributes() in maxiBlockComponent
	const generation = attributes.__cacheGeneration || 0;

	// Sample first 30 keys for performance (balance between accuracy and speed)
	const sample = defaultKeys.slice(0, 30);
	const valueHash = sample
		.map(k => {
			const val = attributes[`${prefix}${k}`];
			if (val === undefined) return '0';
			// For defined values, include type and truncated value
			return `1:${typeof val}:${String(val).slice(0, 10)}`;
		})
		.join('|');

	return `${generation}:${valueHash}`;
};

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false
) => {
	if (!target) return null;

	// Conditional caching strategy:
	// Only cache when cleaned=true (safe, used for cleaned attribute extractions)
	// Don't cache for default cleaned=false case due to complex attribute update patterns
	// from WordPress APIs (updateBlockAttributes, replaceBlock) that may cause stale caches
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
