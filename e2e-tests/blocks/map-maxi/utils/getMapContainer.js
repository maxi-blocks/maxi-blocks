const getMapContainer = async page => {
	const map = await page.$(
		'.maxi-map-block .maxi-map-block__container .leaflet-container'
	);

	return map;
};

export default getMapContainer;
