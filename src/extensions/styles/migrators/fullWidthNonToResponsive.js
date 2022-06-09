import { isNil } from 'lodash';

const fromFullWidthNonToResponsive = ({ attributes, save }) => {
	console.log('here1');
	return {
		isEligible(blockAttributes) {
			console.log('isEligible', blockAttributes);
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
		},

		migrate(oldAttributes) {
			console.log(oldAttributes.blockFullWidth);

			const { blockFullWidth } = oldAttributes;
			delete oldAttributes.blockFullWidth;

			return {
				...oldAttributes,
				'full-width-general': blockFullWidth,
			};
		},

		save(props) {
			console.log(props);
			return save(props, { 'data-align': 'full' });
		},
	};
};

export default fromFullWidthNonToResponsive;
