import { isNil } from 'lodash';

const isEligible = blockAttributes => {
	if (!isNil(blockAttributes.blockFullWidth)) {
		return true;
	}

	return false;
};

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

const saveProps = (prefix, { props, extendedAttributes }) => {
	const { attributes } = props;
	const { fullWidth, blockFullWidth, ...restAttrs } = attributes;

	return [
		{ ...props, attributes: restAttrs },
		{
			...extendedAttributes,
			'data-align': blockFullWidth,
		},
		...(prefix && {
			'data-align': fullWidth,
		}),
	];
};

export default { isEligible, attributes, migrate, saveProps };
