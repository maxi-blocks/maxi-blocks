import getClientId from './getClientId';

const removeBackgroundLayers = async page => {
	const clientId = await getClientId();

	await page.evaluate(
		(clientId, response) => {
			wp.data
				.dispatch('core/block-editor')
				.updateBlockAttributes(clientId, response);
		},
		clientId,
		{ 'background-layers': [] }
	);
};

export default removeBackgroundLayers;
