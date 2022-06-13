import { isNil } from 'lodash';

const fromFullWidthNonToResponsive = ({ attributes, save, prefix }) => {
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
				default: 'normal',
			},
			fullWidth: {
				type: 'string',
				default: 'normal',
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
			console.log(props);
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
