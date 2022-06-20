import { isNil } from 'lodash';

const fromFullWidthNonToResponsive = ({
	attributes,
	save,
	prefix,
	isContainer = false,
}) => {
	return {
		isEligible(blockAttributes) {
			if (!isNil(blockAttributes.blockFullWidth)) {
				return true;
			}

			return false;
		},

		attributes: {
			...attributes,
			blockFullWidth: {
				type: 'string',
				default: isContainer ? 'full' : 'normal',
			},
			fullWidth: {
				type: 'string',
				default: 'normal',
			},
			'position-top-general': {
				type: 'number',
			},
			'position-top-xxl': {
				type: 'number',
			},
			'position-top-xl': {
				type: 'number',
			},
			'position-top-l': {
				type: 'number',
			},
			'position-top-m': {
				type: 'number',
			},
			'position-top-s': {
				type: 'number',
			},
			'position-top-xs': {
				type: 'number',
			},
			'position-right-general': {
				type: 'number',
			},
			'position-right-xxl': {
				type: 'number',
			},
			'position-right-xl': {
				type: 'number',
			},
			'position-right-l': {
				type: 'number',
			},
			'position-right-m': {
				type: 'number',
			},
			'position-right-s': {
				type: 'number',
			},
			'position-right-xs': {
				type: 'number',
			},
			'position-bottom-general': {
				type: 'number',
			},
			'position-bottom-xxl': {
				type: 'number',
			},
			'position-bottom-xl': {
				type: 'number',
			},
			'position-bottom-l': {
				type: 'number',
			},
			'position-bottom-m': {
				type: 'number',
			},
			'position-bottom-s': {
				type: 'number',
			},
			'position-bottom-xs': {
				type: 'number',
			},
			'position-left-general': {
				type: 'number',
			},
			'position-left-xxl': {
				type: 'number',
			},
			'position-left-xl': {
				type: 'number',
			},
			'position-left-l': {
				type: 'number',
			},
			'position-left-m': {
				type: 'number',
			},
			'position-left-s': {
				type: 'number',
			},
			'position-left-xs': {
				type: 'number',
			},
		},

		migrate(oldAttributes) {
			const { blockFullWidth, fullWidth } = oldAttributes;
			delete oldAttributes.blockFullWidth;

			return {
				...oldAttributes,
				'full-width-general': blockFullWidth,
				...(prefix && { [`${prefix}full-width-general`]: fullWidth }),
			};
		},

		save(props) {
			const { attributes } = props;
			const { fullWidth, blockFullWidth, ...restAttrs } = attributes;

			const newSave = save(
				{ ...props, attributes: restAttrs },
				{
					'data-align': blockFullWidth,
				},
				...(prefix && {
					'data-align': fullWidth,
				})
			);

			return newSave;
		},
	};
};

export default fromFullWidthNonToResponsive;
