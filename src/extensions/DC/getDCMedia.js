/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';
import { getACFFieldContent } from './getACFData';
import { getProductsContent } from './getWCContent';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getDCMedia = async (dataRequest, clientId) => {
	const data = await getDCEntity(dataRequest, clientId);

	const { field, source, type } = dataRequest;
	let id;

	if (source === 'acf') {
		const contentValue = await getACFFieldContent(field, data.id);

		return contentValue;
	}

	if (type === 'products') {
		id = await getProductsContent(dataRequest, data);
	}

	if ((!data || !(field in data)) && isNil(id)) return null;

	if (isNil(id)) id = data[field];

	if (isNil(id)) return null;

	const { getMedia } = resolveSelect('core');
	const media = await getMedia(id);

	if (isNil(media)) return null;

	return {
		id,
		url: media.source_url,
		caption: media.caption?.rendered,
	};
};

export default getDCMedia;
