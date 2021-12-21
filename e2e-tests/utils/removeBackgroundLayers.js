import setAttributes from './setAttributes';

const removeBackgroundLayers = async page =>
	setAttributes(page, { 'background-layers': [] });

export default removeBackgroundLayers;
