import getEditorFrame from '../../../utils/getEditorFrame';

const getMapContainer = async page => {
	const frame = await getEditorFrame(page);
	return frame.$('.maxi-map-block .maxi-map-block__container .leaflet-container');
};

export default getMapContainer;
