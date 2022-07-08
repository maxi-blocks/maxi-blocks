import { cloneElement } from '@wordpress/element';

import { isNil } from 'lodash';

const isEligible = blockAttributes => !isNil(blockAttributes.blockFullWidth);

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
	const { blockFullWidth, fullWidth } = newAttributes;
	delete newAttributes.blockFullWidth;

	newAttributes['full-width-general'] = blockFullWidth;
	if (prefix) newAttributes[`${prefix}full-width-general`] = fullWidth;

	return newAttributes;
};

const saveMigrator = (saveInstance, props) => {
	const { attributes } = props;
	const { fullWidth, blockFullWidth } = attributes;

	let newInstance = cloneElement(saveInstance, {
		'data-align': blockFullWidth,
	});

	// Concrete case for Button Maxi
	if (attributes.uniqueID.includes('button')) {
		const buttonChildren = newInstance.props.children;
		const buttonChild = buttonChildren[0];

		buttonChildren[0] = cloneElement({
			...buttonChild,
			props: { ...buttonChild.props, 'data-align': fullWidth },
		});

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

export default { isEligible, attributes, migrate, saveMigrator };
