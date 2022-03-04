import getClientId from './getClientId';

const setAttributes = async (page, response) => {
	const clientId = await getClientId();

	await page.evaluate(
		(clientId, _response) => {
			wp.data
				.dispatch('core/block-editor')
				.updateBlockAttributes(clientId, _response);
		},
		clientId,
		response
	);
};

export default setAttributes;
