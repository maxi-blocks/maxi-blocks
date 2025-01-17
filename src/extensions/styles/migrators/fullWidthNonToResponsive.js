/**
 * WordPress dependencies
 */
import { cloneElement } from '@wordpress/element';

/**
 * External dependencies
 */
import { isNil, isArray } from 'lodash';

// Constants
const NAME = 'Remove Fullwidth to Responsive';
const FULL_WIDTH_GENERAL = 'full-width-general';

const isEligible = blockAttributes =>
	!isNil(blockAttributes.blockFullWidth) && isNil(blockAttributes.fullWidth);

const attributes = isContainer => ({
	blockFullWidth: {
		type: 'string',
		default: isContainer ? 'full' : 'normal',
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
});

const migrate = ({ newAttributes, prefix }) => {
	if (!isEligible(newAttributes)) return newAttributes;

	const { blockFullWidth } = newAttributes;

	// Direct property mutations for better performance
	delete newAttributes.blockFullWidth;
	newAttributes[FULL_WIDTH_GENERAL] = blockFullWidth;

	if (prefix) {
		newAttributes[`${prefix}${FULL_WIDTH_GENERAL}`] = newAttributes.fullWidth;
	}

	return newAttributes;
};

const saveMigrator = (saveInstance, props) => {
	const { attributes: { fullWidth, blockFullWidth, uniqueID } } = props;

	// Create new instance with data-align
	let newInstance = cloneElement(saveInstance, {
		'data-align': blockFullWidth,
	});

	// Handle Button Maxi special case
	if (uniqueID.includes('button')) {
		const buttonChildren = newInstance.props.children;
		const buttonChild = isArray(buttonChildren) ? buttonChildren[0] : buttonChildren;

		// Create new button child with data-align
		const newButtonChild = cloneElement(buttonChild, {
			...buttonChild.props,
			'data-align': fullWidth,
		});

		// Update children based on array status
		const newChildren = isArray(buttonChildren)
			? [newButtonChild, ...buttonChildren.slice(1)]
			: newButtonChild;

		// Create final instance with updated children
		newInstance = cloneElement(newInstance, {
			...newInstance.props,
			children: newChildren,
		});
	}

	return () => newInstance;
};

export default {
	name: NAME,
	isEligible,
	attributes,
	migrate,
	saveMigrator,
};
