/**
 * Internal dependencies
 */
import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import { getBreakpointFromAttribute } from '@extensions/styles/utils';
import { getBlockSelectorsByUniqueID } from './utils';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

// Constants
const NAME = 'Transform';
const TYPES = Object.freeze(['scale', 'translate', 'rotate', 'origin']);

// Pre-define attribute templates for better performance
const ATTRIBUTES = breakpointAttributesCreator({
	obj: {
		'transform-scale-x': {
			type: 'number',
		},
		'transform-scale-y': {
			type: 'number',
		},
		'transform-translate-x-unit': {
			type: 'string',
			default: '%',
		},
		'transform-translate-x': {
			type: 'number',
		},
		'transform-translate-y-unit': {
			type: 'string',
			default: '%',
		},
		'transform-translate-y': {
			type: 'number',
		},
		'transform-rotate-x': {
			type: 'number',
		},
		'transform-rotate-y': {
			type: 'number',
		},
		'transform-rotate-z': {
			type: 'number',
		},
		'transform-origin-x': {
			type: 'string',
		},
		'transform-origin-y': {
			type: 'string',
		},
		'transform-origin-x-unit': {
			type: 'string',
			default: '%',
		},
		'transform-origin-y-unit': {
			type: 'string',
			default: '%',
		},
	},
});

const isEligible = blockAttributes => {
	// Early return for quick fails
	if (!blockAttributes) return false;

	const hasDirectAttribute = Object.keys(blockAttributes).some(key => key in ATTRIBUTES);
	if (hasDirectAttribute) return true;

	const { relations } = blockAttributes;
	if (!relations) return false;

	return relations.some(relation =>
		Object.keys(relation.attributes).some(key => key in ATTRIBUTES)
	);
};

const migrate = props => {
	let newAttributes;
	let selectors;

	if ('newAttributes' in props && 'selectors' in props) {
		({ newAttributes, selectors } = props);
	} else {
		newAttributes = props;
		selectors = getBlockSelectorsByUniqueID(newAttributes.uniqueID);
	}

	if (isEmpty(selectors)) return false;

	const getAxis = attribute => attribute.match(/[x,y,z](-unit)?/)[0];
	const target = Object.entries(selectors).find(
		([, selector]) => selector.normal.target === ''
	)[0];

	// Use for...of for better performance
	for (const [key, attr] of Object.entries(newAttributes)) {
		if (!(key in ATTRIBUTES)) continue;

		for (const type of TYPES) {
			if (!key.match(type) || isNil(attr) || attr === ATTRIBUTES[key].default) continue;

			const breakpoint = getBreakpointFromAttribute(key);
			const transformKey = `transform-${type}-${breakpoint}`;

			// Direct property mutations for better performance
			newAttributes[transformKey] = {
				[target]: {
					normal: {
						...newAttributes[transformKey]?.[target]?.normal,
						[getAxis(key)]: attr,
					},
				},
			};

			delete newAttributes[key];
			break;
		}
	}

	// Handle relations
	if (newAttributes.relations) {
		const newRelations = newAttributes.relations.map(relation => {
			const relationAttributes = { ...relation.attributes };
			const { uniqueID } = relation;
			const relationSelectors = getBlockSelectorsByUniqueID(uniqueID);

			migrate({
				newAttributes: relationAttributes,
				selectors: relationSelectors,
			});

			return { ...relation, attributes: relationAttributes };
		});

		newAttributes.relations = newRelations;
	}

	return newAttributes;
};

export default { name: NAME, attributes: () => ATTRIBUTES, migrate, isEligible };
