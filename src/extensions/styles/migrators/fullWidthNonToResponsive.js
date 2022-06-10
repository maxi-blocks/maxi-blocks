import { cloneElement } from '@wordpress/element';

import { isNil } from 'lodash';

const fromFullWidthNonToResponsive = ({ attributes, save }) => {
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
		},

		migrate(oldAttributes) {
			const { blockFullWidth } = oldAttributes;
			delete oldAttributes.blockFullWidth;

			return {
				...oldAttributes,
				'full-width-general': blockFullWidth,
			};
		},

		save(props) {
			let newSave = save(props, { 'data-align': 'full' });
			// eslint-disable-next-line no-unused-vars
			const { blockFullWidth, ...childProps } = newSave.props;

			newSave = cloneElement({ ...newSave, props: childProps });

			return newSave;
		},
	};
};

export default fromFullWidthNonToResponsive;
