const getMapContainer = async page =>
	page.$('.maxi-map-block .maxi-map-block__container .leaflet-container');

export default getMapContainer;
