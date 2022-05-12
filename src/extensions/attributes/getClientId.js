const getClientId = uniqueID => {
	const element = document.querySelector(`[uniqueId="${uniqueID}"]`);
	const clientId = element ? element.getAttribute('data-block') : null;

	return clientId;
};

export default getClientId;
