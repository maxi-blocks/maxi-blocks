import { cloneElement } from '@wordpress/element';

import { isNil, isArray } from 'lodash';
import getAttributesValue from '../../attributes/getAttributesValue';

const name = 'Remove Fullwidth to Responsive';

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

	newAttributes['full-width-g'] = blockFullWidth;
	if (prefix) newAttributes[`${prefix}_fw-g`] = fullWidth;

	return newAttributes;
};

const saveMigrator = (saveInstance, props) => {
	const { attributes } = props;

	const [fullWidth, blockFullWidth] = getAttributesValue({
		target: ['_fw', 'blockFullWidth'],
		props: attributes,
	});

	let newInstance = cloneElement(saveInstance, {
		'data-align': blockFullWidth,
	});

	// Concrete case for Button Maxi
	if (attributes._uid.includes('button')) {
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

	return props => newInstance;
};

export default {
	name,
	isEligible,
	attributes,
	migrate,
	saveMigrator,
};
