/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import getDCEntity from './getDCEntity';
import { getACFFieldContent } from './getACFData';

const getDCMedia = async (dataRequest, clientId) => {
	const data = await getDCEntity(dataRequest, clientId);

	const { field, source } = dataRequest;

	if (source === 'acf') {
		const contentValue = await getACFFieldContent(field, data.id);

		return contentValue;
	}

	if (!(field in data)) return null;

	const id = data[field];

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
