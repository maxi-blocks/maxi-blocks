import { cloneElement } from '@wordpress/element';

import { isNil, isArray } from 'lodash';

const isEligible = blockAttributes =>
	!isNil(blockAttributes.blockFullWidth) && isNil(blockAttributes.fullWidth);

const attributes = isContainer => {
	return {
		blockFullWidth: {
			type: 'string',
			default: isContainer ? 'full' : 'normal',
		},
		fullWidth: {
			type: 'string',
			default: 'normal',
		},
	};
};

const migrate = ({ newAttributes, prefix }) => {
	if (!isEligible(newAttributes)) return newAttributes;

	const { blockFullWidth, fullWidth } = newAttributes;
	delete newAttributes.blockFullWidth;

	newAttributes['full-width-general'] = blockFullWidth;
	if (prefix) newAttributes[`${prefix}full-width-general`] = fullWidth;

	return newAttributes;
};

const saveMigrator = (saveInstance, props) => {
	const { attributes } = props;

	if (!isEligible(attributes)) return saveInstance;

	const { fullWidth, blockFullWidth } = attributes;

	let newInstance = cloneElement(saveInstance, {
		'data-align': blockFullWidth,
	});

	// Concrete case for Button Maxi
	if (attributes.uniqueID.includes('button')) {
		let buttonChildren = newInstance.props.children;
		const buttonChild = isArray(buttonChildren)
			? buttonChildren[0]
			: buttonChildren;

		const newButtonChild = cloneElement({
			...buttonChild,
			props: { ...buttonChild.props, 'data-align': fullWidth },
		});

		if (isArray(buttonChildren)) buttonChildren[0] = newButtonChild;
		else buttonChildren = newButtonChild;

		newInstance = cloneElement({
			...newInstance,
			props: {
				...newInstance.props,
				children: buttonChildren,
			},
		});
	}

	return newInstance;
};

export default {
	isEligible,
	attributes,
	migrate,
	saveMigrator,
};
