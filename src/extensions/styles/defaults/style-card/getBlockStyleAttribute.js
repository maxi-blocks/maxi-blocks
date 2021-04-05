import { select } from '@wordpress/data';

const getBlockStyleAttribute = props => {
	const { clientId } = props;
	const { getBlockAttributes, getBlockParents } = select('core/block-editor');
	const { blockStyle } = props.attributes;

	switch (blockStyle) {
		case 'maxi-light':
			return 'light';
		case 'maxi-dark':
			return 'dark';
		case 'maxi-parent': {
			return getBlockAttributes(
				getBlockParents(clientId)[0]
			).blockStyle.replace('maxi-', '');
		}
		default:
			return 'light';
	}
};

export default getBlockStyleAttribute;
