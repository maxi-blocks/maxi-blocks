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

const getSaveProps = (
	prefix,
	[props, extendedWrapperAttributes, extendedAttributes]
) => {
	const { attributes } = props;
	const { fullWidth, blockFullWidth, ...restAttrs } = attributes;

	return [
		{ ...props, attributes: restAttrs },
		{
			...extendedWrapperAttributes,
			'data-align': blockFullWidth,
		},
		{
			...extendedAttributes,
			...(prefix && { 'data-align': fullWidth }),
		},
	];
};

export default { isEligible, attributes, migrate, getSaveProps };
