import setAttributes from './setAttributes';

const removeBackgroundLayers = async page => setAttributes(page, { b_ly: [] });

export default removeBackgroundLayers;
