const { select } = wp.data;

const getBlockStyleAttribute = props => {
	const {
		getSelectedBlockClientId,
		getBlockAttributes,
		getBlockParents,
	} = select('core/block-editor');
	const { blockStyle } = props.attributes;

	switch (blockStyle) {
		case 'maxi-light':
			return 'light';
		case 'maxi-dark':
			return 'dark';
		case 'maxi-parent': {
			const clientId = getSelectedBlockClientId();
			return getBlockAttributes(
				getBlockParents(clientId)[0]
			).blockStyle.replace('maxi-', '');
		}
		default:
			return 'light';
	}
};

export default getBlockStyleAttribute;
